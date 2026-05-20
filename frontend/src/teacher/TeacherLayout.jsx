import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/teacher/login");
  };

  const selectSection = (section) => {
    setActiveSection(section);
    setOpen(false);
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", id: "dashboard" },
    { label: "Guruhlar", icon: "🧩", id: "groups" },
    { label: "Talabalar", icon: "🎓", id: "students" }
  ];

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
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeSection === item.id
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="w-full btn-secondary text-sm">Chiqish</button>
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
          <Outlet context={{ activeSection }} />
        </main>
      </div>
    </div>
  );
}
