import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then((r) => { setCourses(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-400/10 dark:bg-brand-500/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Kurslar</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
            {t("courses.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">{t("courses.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">{t("common.noData")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.div
                key={c._id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeUp}
              >
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
