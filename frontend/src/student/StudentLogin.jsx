import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

export default function StudentLogin() {
  const { t } = useTranslation();
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginStudent(username, password);
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
      <form onSubmit={submit} className="card p-8 w-full max-w-md" autoComplete="off">
        <div className="text-center mb-6">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-2xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold">Talaba kirish</h1>
          <p className="text-sm text-slate-500 mt-1">Login va parolingiz bilan kiring</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label block mb-1">Login</label>
            <input
              className="input"
              required
              autoComplete="off"
              name="student-login-uniq"
              placeholder="login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label block mb-1">{t("auth.password")}</label>
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} />
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
