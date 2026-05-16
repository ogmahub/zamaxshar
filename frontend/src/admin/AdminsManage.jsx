import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const PERMS = [
  { key: "applications", label: "Arizalarni boshqarish",   icon: "📝", desc: "Arizalarni ko'rish, qabul/rad qilish" },
  { key: "students",     label: "Talabalarni boshqarish",  icon: "🎓", desc: "Talaba qo'shish, tahrirlash, o'chirish" },
  { key: "teachers",     label: "Ustozlarni boshqarish",   icon: "👨‍🏫", desc: "Ustoz qo'shish, tahrirlash, o'chirish" },
];
const ALL_PERMS = PERMS.map((p) => p.key);
const LIMIT = 20;
const blank = { username: "", password: "", permissions: [...ALL_PERMS] };

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

  const allSelected = ALL_PERMS.every((k) => form.permissions.includes(k));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Adminlar boshqaruvi</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Super Admin — {LIMIT} tagacha qo'shimcha admin qo'sha oladi
          </p>
        </div>
        <button
          onClick={() => { setEditing("new"); setForm({ ...blank }); }}
          className="btn-primary"
        >
          + Yangi admin
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <form onSubmit={submit} className="card p-6">
          <h2 className="text-lg font-bold mb-1">
            {editing && editing !== "new" ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Har bir admin o'z login va paroli bilan kiradi. Qaysi bo'limlarga kira olishini belgilang.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Login *</label>
              <input
                className="input"
                placeholder="adminlogin"
                required
                autoComplete="off"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Parol {editing && editing !== "new" && <span className="text-xs text-slate-400 font-normal">(bo'sh qoldirish mumkin)</span>}
              </label>
              <input
                className="input"
                placeholder={editing && editing !== "new" ? "Yangi parol (ixtiyoriy)" : "Parol kiriting *"}
                type="text"
                required={!editing || editing === "new"}
                autoComplete="off"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Permissions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Ruxsatlar</label>
                <button
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, permissions: allSelected ? [] : [...ALL_PERMS] }))}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                >
                  {allSelected ? "Hammasini olib tashlash" : "Hammasini tanlash"}
                </button>
              </div>
              <div className="space-y-2">
                {PERMS.map((p) => (
                  <label
                    key={p.key}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-2xl border transition-all duration-200 ${
                      form.permissions.includes(p.key)
                        ? "border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-500/10"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-violet-600 shrink-0"
                      checked={form.permissions.includes(p.key)}
                      onChange={() => togglePerm(p.key)}
                    />
                    <span className="text-lg leading-none shrink-0">{p.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{p.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-5">
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm(blank); }}
                className="btn-secondary"
              >
                Bekor
              </button>
            )}
            <button
              type="submit"
              disabled={items.length >= LIMIT && (!editing || editing === "new")}
              className="flex-1 py-3 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-50 transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              {editing && editing !== "new" ? "💾 Saqlash" : "✅ Admin qo'shish"}
            </button>
          </div>
        </form>

        {/* ── List ── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold">Mavjud adminlar</h2>
              <p className="text-xs text-slate-500">{items.length}/{LIMIT} ta admin</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold">
              {items.length}/{LIMIT}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-4xl mb-3">🛡️</div>
              <p className="text-slate-500 text-sm">Hozircha qo'shimcha admin yo'q</p>
              <p className="text-slate-400 text-xs mt-1">Chapdan yangi admin qo'shing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((a) => (
                <div
                  key={a._id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 grid place-items-center text-white font-black text-sm shadow-md">
                        {a.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{a.username}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(a.createdAt).toLocaleDateString("uz-UZ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(a)}
                        className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                      >
                        Tahrir
                      </button>
                      <button
                        onClick={() => remove(a._id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.permissions.length === 0 ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        Hech qanday ruxsat yo'q
                      </span>
                    ) : a.permissions.map((p) => {
                      const meta = PERMS.find((x) => x.key === p);
                      return (
                        <span key={p} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 font-medium">
                          {meta?.icon} {meta?.label || p}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
