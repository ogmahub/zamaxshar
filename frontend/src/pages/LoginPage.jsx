import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        toast.success("Xush kelibsiz!");
        if (result.role === 'admin') navigate('/admin/dashboard');
        else if (result.role === 'student') navigate('/student/dashboard');
        else if (result.role === 'teacher') navigate('/teacher/dashboard');
      } else {
        toast.error(result.message || "Login yoki parol noto'g'ri");
      }
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#EFF6FF] dark:from-[#080D15] dark:via-[#0A1020] dark:to-[#080D15]" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-400/15 dark:bg-brand-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-400/10 dark:bg-violet-500/6 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center mx-auto mb-4 shadow-xl shadow-brand-500/30">
            <span className="text-white font-black text-xl">Z</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t("auth.loginPage.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t("auth.loginPage.subtitle")}
          </p>
        </div>

        {/* Card */}
        <div className="card p-7 shadow-xl shadow-slate-200/80 dark:shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label block mb-2">{t("auth.username")}</label>
              <input
                type="text"
                required
                autoComplete="username"
                className="input"
                placeholder={t("auth.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="label block mb-2">{t("auth.password")}</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input pr-12"
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("common.loading")}
                </span>
              ) : t("auth.login")}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
