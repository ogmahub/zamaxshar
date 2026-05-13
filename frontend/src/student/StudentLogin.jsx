import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudentLogin() {
  const { t } = useTranslation();
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginStudent(phone, password);
      toast.success("Welcome!");
      navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-br from-brand-50 to-brand-200 dark:from-slate-900 dark:to-brand-950">
      <form onSubmit={submit} className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-2xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold">{t("auth.studentLogin")}</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label block mb-1">{t("register.phone")}</label>
            <div className="flex">
              <span className="px-4 grid place-items-center rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">+998</span>
              <input
                className="input rounded-l-none flex-1"
                required
                inputMode="numeric"
                maxLength={9}
                placeholder="901234567"
                value={phone.replace(/^\+998/, "")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setPhone(digits ? `+998${digits}` : "");
                }}
              />
            </div>
          </div>
          <div>
            <label className="label block mb-1">{t("auth.password")}</label>
            <input type="password" className="input" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("common.loading") : t("auth.login")}
          </button>
          <Link to="/" className="block text-center text-sm text-slate-500 hover:text-brand-600 transition pt-2">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </form>
    </div>
  );
}
