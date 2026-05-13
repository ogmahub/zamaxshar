import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const PERMS = [
  { key: "applications", label: "Arizalarni boshqarish" },
  { key: "students",     label: "O'quvchilarni boshqarish" },
  { key: "teachers",     label: "Ustozlarni boshqarish" },
  { key: "admins",       label: "Adminlarga ruxsat berish" }
];
const LIMIT = 20;
const blank = { username: "", password: "", permissions: [] };

export default function AdminsManage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | "new" | id
  const [form, setForm] = useState(blank);

  const load = async () => {
    try { setItems((await api.get("/admins")).data); } catch (e) {
      toast.error(e.response?.data?.error || "Xato");
    }
  };
  useEffect(() => { load(); }, []);

  const togglePerm = (k) => setForm((s) => ({
    ...s,
    permissions: s.permissions.includes(k) ? s.permissions.filter((x) => x !== k) : [...s.permissions, k]
  }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing && editing !== "new") {
        const payload = { username: form.username, permissions: form.permissions };
        if (form.password) payload.password = form.password;
        await api.put(`/admins/${editing}`, payload);
      } else {
        await api.post("/admins", form);
      }
      toast.success("Saqlandi");
      setEditing(null); setForm(blank); load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await api.delete(`/admins/${id}`); load(); } catch {}
  };

  const startEdit = (a) => {
    setEditing(a._id);
    setForm({ username: a.username, password: "", permissions: a.permissions || [] });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Adminlar boshqaruvi</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Bu bo'limda {LIMIT} tagacha qo'shimcha admin ochiladi va ularning qaysi bo'limlarga kira olishi alohida belgilanadi.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="card p-6">
          <h2 className="text-lg font-bold mb-1">
            {editing && editing !== "new" ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Login va kerakli ruxsatlarni tanlang. Har bir admin o'z login va paroli bilan kiradi.
            Parol yangi admin yaratishda majburiy, tahrirlashda ixtiyoriy.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Login</label>
              <input
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-violet-500"
                placeholder="Admin login"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Parol</label>
              <input
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-violet-500"
                placeholder={editing && editing !== "new" ? "Yangi parol (bo'sh qoldirish mumkin)" : "Yangi admin paroli"}
                type="text"
                required={!editing || editing === "new"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="space-y-2 pt-2">
              {PERMS.map((p) => (
                <label key={p.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded accent-violet-600"
                    checked={form.permissions.includes(p.key)}
                    onChange={() => togglePerm(p.key)}
                  />
                  <span className="font-medium text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(blank); }}
                      className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                Bekor qilish
              </button>
            )}
            <button type="submit"
                    disabled={items.length >= LIMIT && (!editing || editing === "new")}
                    className="flex-1 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              {editing && editing !== "new" ? "Saqlash" : "Adminni saqlash"}
            </button>
          </div>
        </form>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-1">Mavjud adminlar</h2>
          <p className="text-sm text-slate-500 mb-5">
            Asosiy admin ruxsat bergan adminlar shu yerda ko'rinadi. Limit: {LIMIT} ta.
          </p>

          {items.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              Hozircha qo'shimcha admin yo'q.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((a) => (
                <div key={a._id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-bold">{a.username}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(a)} className="text-xs text-violet-600 hover:underline">Tahrir</button>
                      <button onClick={() => remove(a._id)} className="text-xs text-rose-600 hover:underline">O'chirish</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.permissions.length === 0 ? (
                      <span className="text-xs text-slate-400">Ruxsatlar yo'q</span>
                    ) : a.permissions.map((p) => (
                      <span key={p} className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {PERMS.find((x) => x.key === p)?.label || p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-xs text-slate-500 text-right">
                {items.length}/{LIMIT}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
