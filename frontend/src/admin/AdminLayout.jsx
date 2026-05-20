import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState } from "react";

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isSuper = !!user?.isSuperAdmin;
  const perms = user?.permissions || [];
  const has = (p) => isSuper || perms.includes(p);

  const allLinks = [
    { to: "/admin/dashboard", label: t("admin.dashboard"), icon: "📊", show: true },
    { to: "/admin/applications", label: t("admin.applications"), icon: "📝", show: has("applications") },
    { to: "/admin/students", label: t("admin.students"), icon: "🎓", show: has("students") },
    { to: "/admin/courses", label: t("admin.courses"), icon: "📚", show: isSuper },
    { to: "/admin/teachers", label: t("admin.teachers"), icon: "👨‍🏫", show: has("teachers") },
    { to: "/admin/admins", label: "Adminlar", icon: "🛡️", show: isSuper }
  ];
  const links = allLinks.filter((l) => l.show);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className={`${open ? "block" : "hidden"} md:block fixed md:static inset-0 md:inset-auto z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col`}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src="/logo.svg" alt="ZAMAXSHAR" className="w-10 h-10 rounded-2xl object-cover" />
            <span>ZAMAXSHAR</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="w-full btn-secondary text-sm">{t("auth.logout")}</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(!open)}>☰</button>
          <div className="flex-1" />
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
