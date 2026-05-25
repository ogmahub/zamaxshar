import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const SUBJECTS = [
  "Ingliz tili", "Iqtisodiyot asoslari", "Geografiya", "Informatika",
  "Astronomiya", "Huquq asoslari", "Geometriya", "Tarix",
  "Biologiya", "Algebra", "Fizika", "Adabiyot",
  "Matematika", "Kimyo", "Ona tili",
];

const MIN = 3;
const MAX = 5;

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    selectedSubjects: [],
    studyMode: "offline", startDate: "", message: ""
  });
  const [loading, setLoading] = useState(false);
  const [subjectError, setSubjectError] = useState("");

  const toggleSubject = (subject) => {
    setSubjectError("");
    setForm((s) => {
      const already = s.selectedSubjects.includes(subject);
      if (!already && s.selectedSubjects.length >= MAX) {
        setSubjectError(`Ko'pi bilan ${MAX} ta fan tanlash mumkin`);
        return s;
      }
      return {
        ...s,
        selectedSubjects: already
          ? s.selectedSubjects.filter((x) => x !== subject)
          : [...s.selectedSubjects, subject],
      };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.selectedSubjects.length < MIN) {
      setSubjectError(`Kamida ${MIN} ta fan tanlang`);
      return;
    }
    setLoading(true);
    try {
      await api.post("/applications", form);
      toast.success(t("register.success"));
      setForm({ firstName: "", lastName: "", phone: "", selectedSubjects: [], studyMode: "offline", startDate: "", message: "" });
      setSubjectError("");
    } catch (err) {
      toast.error(err.response?.data?.error || t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-400/10 dark:bg-brand-500/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4">Ariza</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
            {t("register.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Quyidagi formani to'ldiring va biz siz bilan bog'lanamiz
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={submit} className="card p-7 md:p-10 space-y-6 shadow-xl shadow-slate-200/60 dark:shadow-black/30">

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label block mb-2">{t("register.firstName")} *</label>
                <input
                  className="input"
                  required
                  placeholder="Ism"
                  value={form.firstName}
                  onChange={update("firstName")}
                />
              </div>
              <div>
                <label className="label block mb-2">{t("register.lastName")}</label>
                <input
                  className="input"
                  placeholder="Familiya"
                  value={form.lastName}
                  onChange={update("lastName")}
                />
              </div>
            </div>

            <div>
              <label className="label block mb-2">{t("register.phone")} *</label>
              <div className="flex gap-0">
                <span className="flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/80 font-semibold text-slate-600 dark:text-slate-400 text-sm shrink-0">
                  +998
                </span>
                <input
                  type="tel"
                  className="input rounded-l-none border-l-0 flex-1"
                  required
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="90 123 45 67"
                  value={form.phone.replace(/^\+998/, "")}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setForm((s) => ({ ...s, phone: digits ? `+998${digits}` : "" }));
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Fanlarni tanlang * <span className="text-slate-400 font-normal">(min 3, max 5)</span></label>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  form.selectedSubjects.length >= MIN && form.selectedSubjects.length <= MAX
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {form.selectedSubjects.length} / {MAX}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECTS.map((subject) => {
                  const checked = form.selectedSubjects.includes(subject);
                  const disabled = !checked && form.selectedSubjects.length >= MAX;
                  return (
                    <button
                      key={subject}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleSubject(subject)}
                      className={`relative flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-sm font-medium text-left transition-all duration-200 ${
                        checked
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-500/10"
                          : disabled
                          ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-500/5"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-all ${
                        checked
                          ? "bg-brand-500 border-brand-500"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                      }`}>
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {subject}
                    </button>
                  );
                })}
              </div>
              {subjectError && (
                <p className="mt-2 text-sm text-rose-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {subjectError}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label block mb-2">{t("register.studyMode")}</label>
                <select className="input" value={form.studyMode} onChange={update("studyMode")}>
                  <option value="offline">{t("register.offline")}</option>
                  <option value="online">{t("register.online")}</option>
                </select>
              </div>
              <div>
                <label className="label block mb-2">{t("register.startDate")}</label>
                <input
                  type="date"
                  className="input"
                  value={form.startDate}
                  onChange={update("startDate")}
                />
              </div>
            </div>

            <div>
              <label className="label block mb-2">{t("register.message")}</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Qo'shimcha izoh yoki savollaringiz..."
                value={form.message}
                onChange={update("message")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("common.loading")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("register.submit")} →
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
