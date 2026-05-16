import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";
import TeacherCard from "../components/TeacherCard.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(target);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(num / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, num]);

  return <span ref={ref}>{count}{target.includes("+") ? "+" : ""}</span>;
}

function SectionWrapper({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data.slice(0, 3))).catch(() => {});
    api.get("/teachers").then((r) => setTeachers(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const stats = [
    { label: t("stats.students"), value: "5000+", icon: "🎓", color: "from-brand-400 to-brand-600" },
    { label: t("stats.teachers"), value: "20+",   icon: "👨‍🏫", color: "from-violet-400 to-violet-600" },
    { label: t("stats.courses"),  value: "10+",   icon: "📚", color: "from-amber-400 to-orange-500" },
    { label: t("stats.years"),    value: "5+",    icon: "⭐", color: "from-sky-400 to-blue-600" },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#EFF6FF] dark:from-[#080D15] dark:via-[#0A1020] dark:to-[#080D15]" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-brand-400/20 dark:bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-400/10 dark:bg-violet-500/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-300/10 dark:bg-brand-400/5 blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="max-w-4xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="section-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                O'zbekistonning eng yaxshi o'quv markazi
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6"
            >
              <span className="text-slate-900 dark:text-white">Bilimga </span>
              <span className="gradient-text">yo'l</span>
              <br />
              <span className="text-slate-900 dark:text-white">ZAMAXSHAR</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1 transition-all duration-300 text-sm"
              >
                {t("hero.cta")}
                <span className="text-base">→</span>
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 text-sm"
              >
                {t("hero.secondary")}
              </Link>
            </motion.div>

            {/* floating trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-500"
            >
              {["✓ Sertifikat beriladi", "✓ Tajribali o'qituvchilar", "✓ Online & Offline"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 font-medium">{item}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────── */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="card p-6 text-center group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center text-2xl mx-auto mb-4 shadow-md`}>
                    {s.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                    <AnimatedCounter target={s.value} />
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </SectionWrapper>
        </div>
      </section>

      {/* ─── COURSES ─────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-50/30 dark:via-brand-950/10 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-badge mb-4">Kurslar</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                {t("courses.title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">{t("courses.subtitle")}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c, i) => (
                <motion.div key={c._id} variants={fadeUp} custom={i}>
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link to="/courses" className="btn-secondary">
                {t("hero.secondary")} <span>→</span>
              </Link>
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      {/* ─── TEACHERS ────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="section-badge mb-4">Ustozlar</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                {t("teachers.title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">{t("teachers.subtitle")}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((tc, i) => (
                <motion.div key={tc._id} variants={fadeUp} custom={i}>
                  <TeacherCard teacher={tc} />
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link to="/teachers" className="btn-secondary">
                Barcha ustozlar <span>→</span>
              </Link>
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-600 p-10 md:p-16 text-center shadow-2xl shadow-brand-500/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Kelajagingizni bugun boshlang
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                5000+ talaba bilan birga o'z yo'lingizni toping. Hoziroq ro'yxatdan o'ting.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-600 font-bold text-sm hover:bg-brand-50 hover:-translate-y-1 shadow-xl transition-all duration-300"
              >
                Ro'yxatdan o'tish <span className="text-base">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
