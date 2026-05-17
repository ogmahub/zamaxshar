import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../api/axios.js";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showCert, setShowCert] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/teacher/login");
  };

  useEffect(() => {
    if (!user?.id) return;
    api.get("/students")
      .then((r) => setStudents(r.data.filter((s) => s.teacher?._id === user.id)))
      .catch(() => {});
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 font-bold">
          <img src="/logo.svg" alt="ZAMAXSHAR" className="w-10 h-10 rounded-2xl object-cover" />
          ZAMAXSHAR
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{theme === "dark" ? "☀️" : "🌙"}</button>
          <button onClick={handleLogout} className="btn-secondary text-sm">Chiqish</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">O'qituvchi paneli</h1>

        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-500 grid place-items-center text-2xl text-white font-bold flex-shrink-0">
              {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : (user.name || "?").charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">{user.name}</div>
              <div className="text-sm text-indigo-600 font-medium">{user.subject}</div>
              <div className="text-xs text-slate-500">@{user.username}</div>
              {user.bio && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{user.bio}</p>}
            </div>
            {user.certificate && (
              <button
                onClick={() => setShowCert(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition"
              >
                <span className="text-lg">🎓</span> Sertifikatni ko'rish
              </button>
            )}
          </div>
          {!user.certificate && (
            <div className="mt-3 text-xs text-slate-500">
              Sertifikat hali yuklanmagan. Super admin profil bo'limidan sertifikat yuklab beradi.
            </div>
          )}
        </div>

        {showCert && user.certificate && (
          <div
            onClick={() => setShowCert(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="font-bold">Sertifikat — {user.name}</div>
                <div className="flex gap-2">
                  <a href={user.certificate} download={`sertifikat_${user.name}.png`} className="text-sm px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Yuklab olish</a>
                  <button onClick={() => setShowCert(false)} className="text-sm px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold">Yopish</button>
                </div>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-60px)] grid place-items-center bg-slate-100 dark:bg-slate-950">
                {user.certificate.startsWith("data:application/pdf") || user.certificate.endsWith(".pdf") ? (
                  <iframe src={user.certificate} title="Sertifikat" className="w-full h-[80vh] rounded-lg bg-white" />
                ) : (
                  <img src={user.certificate} alt="Sertifikat" className="max-w-full max-h-[80vh] rounded-lg shadow" />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Mening talabalarim ({students.length})</h2>
          {students.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Hozircha biriktirilgan talaba yo'q.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Ism</th>
                    <th className="px-4 py-3 text-left">Login</th>
                    <th className="px-4 py-3 text-left">Telefon</th>
                    <th className="px-4 py-3 text-left">Kurs</th>
                    <th className="px-4 py-3 text-left">To'lov</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium">{s.firstName} {s.lastName}</td>
                      <td className="px-4 py-3">{s.username}</td>
                      <td className="px-4 py-3">{s.phone || "—"}</td>
                      <td className="px-4 py-3">{s.course?.titleUz || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                          s.paymentStatus === "expired" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{s.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
