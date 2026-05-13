import { useState } from "react";

export default function TeacherCard({ teacher }) {
  const [showCert, setShowCert] = useState(false);

  return (
    <>
      <div className="card p-6 text-center hover:shadow-xl transition">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-200 to-brand-500 mx-auto mb-4 grid place-items-center text-3xl text-white font-bold overflow-hidden shadow-lg ring-4 ring-white dark:ring-slate-800">
          {teacher.photo ? (
            <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            teacher.name.charAt(0)
          )}
        </div>
        <h3 className="font-bold text-lg">{teacher.name}</h3>
        <p className="text-sm text-brand-600 mb-2">{teacher.subject}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">{teacher.bio}</p>
        <div className="flex flex-col items-center gap-2">
          {teacher.phone && (
            <a href={`tel:${teacher.phone}`} className="text-xs text-slate-500 hover:text-brand-600">
              📞 {teacher.phone}
            </a>
          )}
          {teacher.certificate && (
            <button onClick={() => setShowCert(true)} className="text-xs font-semibold text-brand-600 hover:underline">
              📜 Sertifikatni ko'rish
            </button>
          )}
        </div>
      </div>

      {showCert && teacher.certificate && (
        <div className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-4" onClick={() => setShowCert(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-2xl p-4 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold">{teacher.name}</div>
                <div className="text-xs text-slate-500">{teacher.subject} - Sertifikat</div>
              </div>
              <button onClick={() => setShowCert(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            </div>
            {teacher.certificate.startsWith("data:application/pdf") ? (
              <iframe src={teacher.certificate} className="w-full h-[70vh] rounded-lg" title="cert" />
            ) : (
              <img src={teacher.certificate} alt="" className="w-full max-h-[70vh] object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
