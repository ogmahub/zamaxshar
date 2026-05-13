import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState } from "react";
import i18n from "../i18n/index.js";

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/teachers", label: t("nav.teachers") },
    { to: "/register", label: t("nav.register") },
    { to: "/contact", label: t("nav.contact") }
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white">Z</span>
          <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">{t("brand")}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "text-brand-600 bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={i18n.language}
            onChange={(e) => changeLang(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          >
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Theme toggle">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link to="/admin/login" className="hidden sm:inline-flex btn-secondary text-xs">{t("nav.adminLogin")}</Link>
          <Link to="/student/login" className="hidden sm:inline-flex btn-primary text-xs">{t("nav.studentLogin")}</Link>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1 border-t border-slate-200 dark:border-slate-800">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
