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
    navigate("/login", { replace: true });
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
          <div className="space-y-6">

            {/* Shaxsiy ma'lumot */}
            <div className="card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-600 grid place-items-center text-2xl text-white font-bold flex-shrink-0">
                  {(data.firstName || "?").charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg">{data.firstName} {data.lastName}</div>
                  {data.phone && <div className="text-sm text-slate-500">📞 {data.phone}</div>}
                  <div className="text-xs text-slate-400 mt-0.5">Login: <span className="font-medium text-slate-600 dark:text-slate-300">{data.username}</span></div>
                </div>
              </div>
              {Array.isArray(data.selectedSubjects) && data.selectedSubjects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Tanlangan fanlar ({data.selectedSubjects.length} ta)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.selectedSubjects.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ---- Ko'p fanlar (enrollments) ---- */}
            {Array.isArray(data.enrollments) && data.enrollments.length > 0 ? (
              <>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Mening fanlarim ({data.enrollments.length} ta)</div>
                {data.enrollments.map((en, idx) => (
                  <div key={en._id || idx} className="card p-6 border-l-4 border-brand-500 space-y-4">
                    {/* Fan nomi */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">Fan #{idx + 1}</div>
                        <div className="text-xl font-bold">{en.course?.titleUz || "—"}</div>
                        {en.course?.descriptionUz && <p className="text-sm text-slate-500 mt-1">{en.course.descriptionUz}</p>}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {en.course?.duration && <span className="px-2 py-0.5 rounded-full text-xs bg-brand-50 dark:bg-brand-500/10 text-brand-700">{en.course.duration}</span>}
                          {(en.format || en.course?.format) && <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 capitalize">{en.format || en.course?.format}</span>}
                          {en.status === "inactive" && <span className="px-2 py-0.5 rounded-full text-xs bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">Nofaol</span>}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${PAYMENT_COLORS[en.paymentStatus] || PAYMENT_COLORS.unpaid}`}>
                        {en.paymentStatus === "paid" ? "To'langan" : en.paymentStatus === "expired" ? "Muddati tugagan" : "To'lanmagan"}
                      </span>
                    </div>

                    {/* O'qituvchi */}
                    {en.teacher && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-300 to-indigo-500 grid place-items-center text-lg text-white font-bold overflow-hidden flex-shrink-0">
                          {en.teacher.photo
                            ? <img src={en.teacher.photo} alt="" className="w-full h-full object-cover" />
                            : (en.teacher.name || "?").charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{en.teacher.name}</div>
                          <div className="text-xs text-brand-600">{en.teacher.subject} o'qituvchisi</div>
                          {en.teacher.phone && <div className="text-xs text-slate-400">📞 {en.teacher.phone}</div>}
                        </div>
                      </div>
                    )}

                    {/* Jadval */}
                    {(en.group || en.lessonStartTime || en.lessonEndTime) && (
                      <div className="grid sm:grid-cols-3 gap-2 text-sm">
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                          <div className="text-xs text-slate-400 mb-0.5">Guruh</div>
                          <div className="font-semibold">{en.group || "—"}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                          <div className="text-xs text-slate-400 mb-0.5">Boshlanish</div>
                          <div className="font-semibold">{en.lessonStartTime || "—"}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                          <div className="text-xs text-slate-400 mb-0.5">Tugash</div>
                          <div className="font-semibold">{en.lessonEndTime || "—"}</div>
                        </div>
                      </div>
                    )}

                    {/* Hafta kunlari */}
                    {Array.isArray(en.weekdays) && en.weekdays.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {en.weekdays.map((day) => (
                          <span key={day} className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                            {day}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* To'lov muddati */}
                    {(en.validFrom || en.validUntil) && (
                      <div className="text-xs text-slate-400 space-x-3">
                        {en.validFrom && <span>Boshlanish: <span className="text-slate-600 dark:text-slate-300">{new Date(en.validFrom).toLocaleDateString()}</span></span>}
                        {en.validUntil && <span>Tugash: <span className="text-slate-600 dark:text-slate-300">{new Date(en.validUntil).toLocaleDateString()}</span></span>}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              /* ---- Eski (legacy) ko'rinish ---- */
              <>
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
                        <div className="text-sm font-medium text-brand-600">{data.teacher.subject} o'qituvchisi</div>
                        {data.teacher.phone && <div className="text-xs text-slate-500 mt-1">📞 {data.teacher.phone}</div>}
                      </div>
                    </div>
                  ) : <div className="text-slate-400 italic text-sm">O'qituvchi hali biriktirilmagan</div>}
                </div>

                {data.course && (
                  <div className="card p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Siz o'qiyotgan kurs</div>
                    <div className="text-xl font-bold mb-1">{data.course.titleUz}</div>
                    <p className="text-sm text-slate-500">{data.course.descriptionUz}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700">{data.course.duration}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800">{data.course.format}</span>
                    </div>
                  </div>
                )}

                {(data.group || data.lessonStartTime || data.lessonEndTime) && (
                  <div className="card p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Dars jadvali</div>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-400 mb-1">Guruh</div><div className="font-semibold">{data.group || "—"}</div></div>
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-400 mb-1">Boshlanish</div><div className="font-semibold">{data.groupStartTime || data.lessonStartTime || "—"}</div></div>
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-400 mb-1">Tugash</div><div className="font-semibold">{data.groupEndTime || data.lessonEndTime || "—"}</div></div>
                    </div>
                    {Array.isArray(data.groupWeekdays) && data.groupWeekdays.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.groupWeekdays.map((day) => (
                          <span key={day} className="px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-sm font-semibold">{day}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
              </>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
