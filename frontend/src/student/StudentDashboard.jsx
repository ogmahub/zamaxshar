import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const PAYMENT_COLORS = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  unpaid: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  expired: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
};

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/students/me").then((r) => setData(r.data)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/student/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 font-bold">
          <img src="/logo.svg" alt="ZAMAXSHAR" className="w-10 h-10 rounded-2xl object-cover" />
          ZAMAXSHAR
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{theme === "dark" ? "☀️" : "🌙"}</button>
          <button onClick={handleLogout} className="btn-secondary text-sm">{t("auth.logout")}</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("student.dashboard")}</h1>
          <p className="text-slate-500 text-sm mt-1">Xush kelibsiz, <span className="font-semibold text-slate-700 dark:text-slate-200">{data?.firstName}</span>!</p>
        </div>

        {!data ? (
          <div className="text-center text-slate-500 py-20">{t("common.loading")}</div>
        ) : (
          <div className="space-y-5">

            {/* O'qituvchi — asosiy karta */}
            <div className="card p-6 border-l-4 border-brand-500">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-3">Sizning o'qituvchingiz</div>
              {data.teacher ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-600 grid place-items-center text-2xl text-white font-bold overflow-hidden flex-shrink-0 shadow-lg">
                    {data.teacher.photo
                      ? <img src={data.teacher.photo} alt="" className="w-full h-full object-cover" />
                      : (data.teacher.name || "?").charAt(0)}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{data.teacher.name}</div>
                    <div className="text-sm font-medium text-brand-600 mt-0.5">{data.teacher.subject} o'qituvchisi</div>
                    {data.teacher.phone && (
                      <div className="text-xs text-slate-500 mt-1">📞 {data.teacher.phone}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 italic text-sm">O'qituvchi hali biriktirilmagan</div>
              )}
            </div>

            {/* Kurs */}
            {data.course && (
              <div className="card p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Siz o'qiyotgan kurs</div>
                <div className="text-xl font-bold mb-1">{data.course.titleUz}</div>
                <p className="text-sm text-slate-500">{data.course.descriptionUz}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300">{data.course.duration}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{data.course.format}</span>
                </div>
              </div>
            )}

            {/* Dars jadvali */}
            {(data.group || data.lessonStartTime || data.lessonEndTime) && (
              <div className="card p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Dars jadvali</div>
                <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <div className="text-xs text-slate-400 mb-1">Guruh</div>
                    <div className="font-semibold">{data.group || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <div className="text-xs text-slate-400 mb-1">Boshlanish</div>
                    <div className="font-semibold">{data.groupStartTime || data.lessonStartTime || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <div className="text-xs text-slate-400 mb-1">Tugash</div>
                    <div className="font-semibold">{data.groupEndTime || data.lessonEndTime || "—"}</div>
                  </div>
                </div>
                {Array.isArray(data.groupWeekdays) && data.groupWeekdays.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Hafta kunlari</div>
                    <div className="flex flex-wrap gap-2">
                      {data.groupWeekdays.map((day) => (
                        <span key={day} className="px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* To'lov holati va talaba ma'lumotlari */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="card p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">To'lov holati</div>
                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${PAYMENT_COLORS[data.paymentStatus]}`}>
                  {t(`status.${data.paymentStatus}`)}
                </span>
                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  {data.validFrom && <div>Boshlanish: <span className="text-slate-700 dark:text-slate-300">{new Date(data.validFrom).toLocaleDateString()}</span></div>}
                  {data.validUntil && <div>Tugash: <span className="text-slate-700 dark:text-slate-300">{new Date(data.validUntil).toLocaleDateString()}</span></div>}
                </div>
              </div>

              <div className="card p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Shaxsiy ma'lumot</div>
                <div className="font-bold text-lg">{data.firstName} {data.lastName}</div>
                {data.phone && <div className="text-sm text-slate-500 mt-1">📞 {data.phone}</div>}
                <div className="text-sm text-slate-500 mt-1">Login: <span className="font-medium text-slate-700 dark:text-slate-300">{data.username}</span></div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
