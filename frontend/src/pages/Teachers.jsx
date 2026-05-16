import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import TeacherCard from "../components/TeacherCard.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Teachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teachers").then((r) => { setTeachers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-400/10 dark:bg-violet-500/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Jamoa</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
            {t("teachers.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">{t("teachers.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 text-center animate-pulse">
                <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-slate-800 mx-auto mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">{t("common.noData")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((tc, i) => (
              <motion.div
                key={tc._id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeUp}
              >
                <TeacherCard teacher={tc} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
