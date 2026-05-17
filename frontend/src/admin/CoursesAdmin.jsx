import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const blank = {
  titleUz: "", titleRu: "", titleEn: "",
  descriptionUz: "", descriptionRu: "", descriptionEn: "",
  price: 0, duration: "", format: "offline",
  modules: "", results: "", isActive: true
};

export default function CoursesAdmin() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const load = async () => { try { setItems((await api.get("/courses")).data); } catch {} };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      titleRu: form.titleUz,
      titleEn: form.titleUz,
      descriptionRu: form.descriptionUz,
      descriptionEn: form.descriptionUz,
      price: Number(form.price) || 0,
      modules: form.modules.split("\n").map((m) => m.trim()).filter(Boolean),
      results: form.results.split("\n").map((m) => m.trim()).filter(Boolean)
    };
    try {
      if (editing && editing !== "new") await api.put(`/courses/${editing}`, payload);
      else await api.post("/courses", payload);
      toast.success("Saqlandi");
      setEditing(null); setForm(blank); load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await api.delete(`/courses/${id}`); load(); } catch {}
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm({
      ...c,
      modules: (c.modules || []).join("\n"),
      results: (c.results || []).join("\n")
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{t("admin.courses")}</h1>
        <button onClick={() => { setEditing("new"); setForm(blank); }} className="btn-primary">+ Yangi</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c._id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold">{c.titleUz}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {c.isActive ? "Faol" : "Nofaol"}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{c.descriptionUz}</p>
            <div className="flex gap-2 text-xs text-slate-500 mb-4">
              <span>{c.duration}</span>•<span>{c.format}</span>•<span>{c.price.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="btn-secondary text-sm flex-1">{t("common.edit")}</button>
              <button onClick={() => remove(c._id)} className="btn-secondary text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card p-6 w-full max-w-3xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">{editing === "new" ? "Yangi kurs" : "Tahrirlash"}</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3"><label className="label block mb-1">Kurs nomi</label><input className="input" required value={form.titleUz} onChange={(e) => setForm({ ...form, titleUz: e.target.value })} /></div>
              <div className="sm:col-span-3"><label className="label block mb-1">Tavsif</label><textarea className="input" rows={3} value={form.descriptionUz} onChange={(e) => setForm({ ...form, descriptionUz: e.target.value })} /></div>
              <div><label className="label block mb-1">Narx</label><input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><label className="label block mb-1">Davomiylik</label><input className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
              <div>
                <label className="label block mb-1">Format</label>
                <select className="input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="sm:col-span-3"><label className="label block mb-1">Modullar (har satrda bittadan)</label><textarea className="input" rows={3} value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} /></div>
              <div className="sm:col-span-3"><label className="label block mb-1">Natijalar (har satrda bittadan)</label><textarea className="input" rows={3} value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} /></div>
              <div className="sm:col-span-3 flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><label>Faol</label></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Bekor</button>
              <button type="submit" className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
