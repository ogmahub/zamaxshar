import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import i18n from "../i18n/index.js";

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/teachers", label: t("nav.teachers") },
    { to: "/register", label: t("nav.register") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-white/85 dark:bg-[#080D15]/85 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-slate-200/60 dark:border-slate-800/60"
        : "bg-white/50 dark:bg-[#080D15]/50 backdrop-blur-xl border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-2xl grid place-items-center shadow-md shadow-black/20 group-hover:shadow-brand-500/30 transition-all duration-300 group-hover:scale-105 overflow-hidden">
            <img
              src="/logo.svg"
              alt="ZAMAXSHAR"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <span className="font-black text-lg tracking-tight gradient-text">{t("brand")}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <select
              value={i18n.language}
              onChange={(e) => changeLang(e.target.value)}
              className="appearance-none text-xs font-semibold pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/70 backdrop-blur text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" style={{ fontSize: 9 }}>▼</div>
          </div>

          <button
            onClick={toggle}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center transition-colors"
          >
            <span className="text-base leading-none">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            {t("nav.login")}
          </Link>

          <button
            className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center transition-colors"
            onClick={() => setOpen(!open)}
          >
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-[#080D15]/90 backdrop-blur-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="pt-3 flex items-center gap-2">
                <select
                  value={i18n.language}
                  onChange={(e) => changeLang(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <option value="uz">UZ</option>
                  <option value="ru">RU</option>
                  <option value="en">EN</option>
                </select>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-2.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold"
                >
                  {t("nav.login")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
