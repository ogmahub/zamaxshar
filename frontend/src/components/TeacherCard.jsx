import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherCard({ teacher }) {
  const [showCert, setShowCert] = useState(false);

  const initials = teacher.name
    ? teacher.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : "?";

  return (
    <>
      <div className="group card p-6 text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 transition-all duration-500">
        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-500 group-hover:scale-105">
            {teacher.photo ? (
              <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-white">{initials}</span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-400 border-2 border-white dark:border-slate-900 shadow-sm" />
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{teacher.name}</h3>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
          {teacher.subject}
        </span>

        {teacher.bio && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {teacher.bio}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              📞 {teacher.phone}
            </a>
          )}
          {teacher.certificate && (
            <button
              onClick={() => setShowCert(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
            >
              📜 Sertifikat
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCert && teacher.certificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 grid place-items-center p-4"
            onClick={() => setShowCert(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{teacher.name}</div>
                  <div className="text-xs text-slate-500">{teacher.subject} — Sertifikat</div>
                </div>
                <button
                  onClick={() => setShowCert(false)}
                  className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center transition-colors text-slate-600 dark:text-slate-400 font-bold"
                >
                  ✕
                </button>
              </div>
              {teacher.certificate.startsWith("data:application/pdf") ? (
                <iframe src={teacher.certificate} className="w-full h-[70vh] rounded-2xl" title="cert" />
              ) : (
                <img src={teacher.certificate} alt="" className="w-full max-h-[70vh] object-contain rounded-2xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
