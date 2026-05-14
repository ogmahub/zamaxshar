import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

export default function AdminLogin() {
  const { t } = useTranslation();
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(username, password);
      toast.success("Welcome!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const [tab, setTab] = useState("super");

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-br from-brand-50 to-brand-200 dark:from-slate-900 dark:to-brand-950">
      <form onSubmit={submit} className="card p-8 w-full max-w-md" autoComplete="off">
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6">
          <button type="button" onClick={() => setTab("super")}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
              tab === "super"
                ? "text-white shadow-lg"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            style={tab === "super" ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}>
            Super admin
          </button>
          <button type="button" onClick={() => setTab("admin")}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
              tab === "admin"
                ? "text-white shadow-lg"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            style={tab === "admin" ? { background: "linear-gradient(135deg, #1e293b, #334155)" } : {}}>
            Admin
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl text-white text-2xl mb-3"
               style={{ background: tab === "super" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "linear-gradient(135deg, #10b981, #059669)" }}>
            {tab === "super" ? "👑" : "🔐"}
          </div>
          <h1 className="text-2xl font-bold">
            {tab === "super" ? "Super admin kirish" : "Admin kirish"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {tab === "super" ? "Asosiy admin login bilan kiring" : "Sizga berilgan admin login bilan kiring"}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label block mb-1">{t("auth.username")}</label>
            <input className="input" autoComplete="off" name="admin-login-uniq" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="label block mb-1">{t("auth.password")}</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
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
