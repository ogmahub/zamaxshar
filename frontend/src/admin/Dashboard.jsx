import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    apps: 0, newApps: 0, accepted: 0, rejected: 0,
    students: 0, paid: 0, unpaid: 0,
    courses: 0, teachers: 0
  });

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled([
        api.get("/applications"),
        api.get("/students"),
        api.get("/courses"),
        api.get("/teachers")
      ]);
      const toArr = (raw) => {
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          for (const k of ["items","data","applications","students","courses","teachers","list","results"]) {
            if (Array.isArray(raw[k])) return raw[k];
          }
        }
        return [];
      };
      const val = (i) => toArr(results[i].status === "fulfilled" ? results[i].value?.data : null);
      const apps = val(0);
      const students = val(1);
      const courses = val(2);
      const teachers = val(3);
      setStats({
        apps: apps.length,
        newApps: apps.filter((a) => a.status === "new").length,
        accepted: apps.filter((a) => a.status === "accepted").length,
        rejected: apps.filter((a) => a.status === "rejected").length,
        students: students.length,
        paid: students.filter((s) => s.paymentStatus === "paid").length,
        unpaid: students.filter((s) => s.paymentStatus === "unpaid").length,
        courses: courses.length,
        teachers: teachers.length
      });
    })();
  }, []);

  const cards = [
    { label: t("admin.totalApplications"), value: stats.apps, icon: "📝", color: "from-blue-500 to-blue-700", to: "/admin/applications" },
    { label: t("admin.newApplications"), value: stats.newApps, icon: "🆕", color: "from-amber-500 to-amber-700", to: "/admin/applications?status=new" },
    { label: t("admin.acceptedApplications"), value: stats.accepted, icon: "✅", color: "from-emerald-500 to-emerald-700", to: "/admin/applications?status=accepted" },
    { label: t("admin.rejectedApplications"), value: stats.rejected, icon: "❌", color: "from-rose-500 to-rose-700", to: "/admin/applications?status=rejected" },
    { label: t("admin.totalStudents"), value: stats.students, icon: "🎓", color: "from-violet-500 to-violet-700", to: "/admin/students" },
    { label: t("admin.paidStudents"), value: stats.paid, icon: "💚", color: "from-green-500 to-green-700", to: "/admin/students?payment=paid" },
    { label: t("admin.unpaidStudents"), value: stats.unpaid, icon: "⏳", color: "from-orange-500 to-orange-700", to: "/admin/students?payment=unpaid" },
    { label: t("admin.courses"), value: stats.courses, icon: "📚", color: "from-cyan-500 to-cyan-700", to: "/admin/courses" },
    { label: t("admin.teachers"), value: stats.teachers, icon: "👨‍🏫", color: "from-fuchsia-500 to-fuchsia-700", to: "/admin/teachers" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold">{t("admin.dashboard")}</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Link key={i} to={c.to} className="card p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group cursor-pointer block">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-2xl group-hover:scale-110 transition`}>{c.icon}</div>
              <span className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition">→</span>
            </div>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
