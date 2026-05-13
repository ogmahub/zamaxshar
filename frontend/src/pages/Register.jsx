import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{t("register.title")}</h1>
      </div>

      <form onSubmit={submit} className="card p-6 md:p-10 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label block mb-1">{t("register.firstName")}</label>
            <input className="input" required value={form.firstName} onChange={update("firstName")} />
          </div>
          <div>
            <label className="label block mb-1">{t("register.lastName")}</label>
            <input className="input" value={form.lastName} onChange={update("lastName")} />
          </div>
        </div>

        <div>
          <label className="label block mb-1">{t("register.phone")}</label>
          <div className="flex">
            <span className="px-4 grid place-items-center rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">+998</span>
            <input
              type="tel"
              className="input rounded-l-none flex-1"
              required
              inputMode="numeric"
              maxLength={9}
              placeholder="901234567"
              value={form.phone.replace(/^\+998/, "")}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                setForm((s) => ({ ...s, phone: digits ? `+998${digits}` : "" }));
              }}
            />
          </div>
        </div>

        <div>
          <label className="label block mb-1">{t("register.course")}</label>
          <select className="input" required value={form.course} onChange={update("course")}>
            <option value="">—</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.titleUz}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label block mb-1">{t("register.studyMode")}</label>
            <select className="input" value={form.studyMode} onChange={update("studyMode")}>
              <option value="offline">{t("register.offline")}</option>
              <option value="online">{t("register.online")}</option>
            </select>
          </div>
          <div>
            <label className="label block mb-1">{t("register.startDate")}</label>
            <input type="date" className="input" value={form.startDate} onChange={update("startDate")} />
          </div>
        </div>

        <div>
          <label className="label block mb-1">{t("register.message")}</label>
          <textarea className="input" rows={3} value={form.message} onChange={update("message")} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? t("common.loading") : t("register.submit")}
        </button>
      </form>
    </div>
  );
}
