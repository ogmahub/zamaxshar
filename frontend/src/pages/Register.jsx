import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function Register() {
  const { t } = useTranslation();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    course: location.state?.courseId || "",
    studyMode: "offline", startDate: "", message: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/applications", form);
      toast.success(t("register.success"));
      setForm({ firstName: "", lastName: "", phone: "", course: "", studyMode: "offline", startDate: "", message: "" });
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
              <label className="label block mb-2">{t("register.course")} *</label>
              <select className="input" required value={form.course} onChange={update("course")}>
                <option value="">— Kursni tanlang —</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.titleUz}</option>
                ))}
              </select>
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
