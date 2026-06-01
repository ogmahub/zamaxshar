import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/announcements/all");
        setAnnouncements(data);
      } catch (err) {
        console.error("Error loading announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInterest = (ann) => {
    toast.success(`${ann.subject} e'loniga qiziqish bildirdingiz`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">E'lonlar</h1>
        <p className="text-slate-600 dark:text-slate-400">Ustozlar bergan dars e'lonlarini ko'ring</p>
      </div>

      {announcements.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Hali e'lon yo'q</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="card overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {ann.image && (
                <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-600 overflow-hidden">
                  <img
                    src={ann.image}
                    alt={ann.subject}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {ann.subject}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Ustoz: {ann.teacherName}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📚</span>
                    <span>{ann.grades}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span>{ann.lessonTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    <span>{ann.seats} ta joy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <a href={`tel:${ann.phone}`} className="text-brand-500 hover:underline">
                      {ann.phone}
                    </a>
                  </div>
                  {ann.telegram && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <a
                        href={`https://t.me/${ann.telegram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:underline"
                      >
                        {ann.telegram}
                      </a>
                    </div>
                  )}
                </div>

                {ann.description && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                    {ann.description}
                  </p>
                )}

                <button
                  onClick={() => handleInterest(ann)}
                  className="mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  Qiziqaman
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
