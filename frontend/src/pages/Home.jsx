import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";
import TeacherCard from "../components/TeacherCard.jsx";

export default function Home() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data.slice(0, 3))).catch(() => {});
    api.get("/teachers").then((r) => setTeachers(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const stats = [
    { label: t("stats.students"), value: "5000+" },
    { label: t("stats.teachers"), value: "20+" },
    { label: t("stats.courses"), value: "10+" },
    { label: t("stats.years"), value: "5+" }
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-slate-900 dark:via-slate-950 dark:to-brand-950/30" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              {t("hero.title")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/register" className="btn-primary">{t("hero.cta")}</Link>
            <Link to="/courses" className="btn-secondary">{t("hero.secondary")}</Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-600">{s.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("courses.title")}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t("courses.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/courses" className="btn-secondary">{t("hero.secondary")}</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("teachers.title")}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t("teachers.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((tc) => <TeacherCard key={tc._id} teacher={tc} />)}
        </div>
      </section>
    </div>
  );
}
