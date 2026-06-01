import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function TeacherAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    grades: "",
    lessonTime: "",
    seats: "",
    phone: "",
    telegram: "",
    image: "",
    description: ""
  });

  const load = async () => {
    try {
      const { data } = await api.get("/announcements/teacher/my");
      setAnnouncements(data);
    } catch (err) {
      console.error("Error loading announcements:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({ ...form, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.grades || !form.lessonTime || !form.seats || !form.phone) {
      toast.error("Majburiy maydonlarni to'ldiring");
      return;
    }

    setLoading(true);
    try {
      await api.post("/announcements/create", form);
      toast.success("E'lon yaratildi");
      setForm({
        subject: "",
        grades: "",
        lessonTime: "",
        seats: "",
        phone: "",
        telegram: "",
        image: "",
        description: ""
      });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success("E'lon o'chirildi");
      load();
    } catch (err) {
      toast.error("Xato");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">E'lonlar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {showForm ? "Bekor" : "+ Yangi e'lon"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">E'lon yaratish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label block mb-1">Fan nomi *</label>
                <input
                  type="text"
                  className="input"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Sinflar *</label>
                <input
                  type="text"
                  className="input"
                  value={form.grades}
                  onChange={(e) => setForm({ ...form, grades: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Dars vaqti *</label>
                <input
                  type="text"
                  className="input"
                  value={form.lessonTime}
                  onChange={(e) => setForm({ ...form, lessonTime: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Joylar soni *</label>
                <input
                  type="number"
                  className="input"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Telefon *</label>
                <input
                  type="tel"
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Telegram</label>
                <input
                  type="text"
                  className="input"
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label block mb-1">Rasm yoki banner</label>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={handleImageUpload}
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
              )}
            </div>

            <div>
              <label className="label block mb-1">Izoh</label>
              <textarea
                className="input resize-none"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Bekor
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-60 transition-colors"
              >
                {loading ? "Saqlanmoqda..." : "E'lon berish"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <div className="card p-8 text-center text-slate-500 dark:text-slate-400">
            Hali e'lon yo'q
          </div>
        ) : (
          announcements.map((ann) => (
            <div key={ann._id} className="card p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ann.subject}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sinflar: {ann.grades}</p>
                </div>
                <button
                  onClick={() => handleDelete(ann._id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  O'chirish
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                <p>⏰ {ann.lessonTime}</p>
                <p>👥 {ann.seats} ta joy</p>
                <p>📞 {ann.phone}</p>
                {ann.telegram && <p>💬 {ann.telegram}</p>}
              </div>
              {ann.description && (
                <p className="text-sm text-slate-700 dark:text-slate-300">{ann.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
