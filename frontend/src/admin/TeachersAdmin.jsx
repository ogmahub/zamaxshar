import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const blank = { name: "", phone: "", subject: "", bio: "", photo: "", certificate: "", isActive: true };

export default function TeachersAdmin() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [previewCert, setPreviewCert] = useState(null);
  const photoInput = useRef();
  const certInput = useRef();

  const load = async () => { try { setItems((await api.get("/teachers")).data); } catch {} };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, phone: form.phone.startsWith("+") ? form.phone : `+998${form.phone}` };
      if (editing && editing !== "new") await api.put(`/teachers/${editing}`, payload);
      else await api.post("/teachers", payload);
      toast.success("Saqlandi");
      setEditing(null); setForm(blank); load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await api.delete(`/teachers/${id}`); load(); } catch {}
  };

  const startEdit = (tc) => {
    setEditing(tc._id);
    const phone = (tc.phone || "").replace("+998", "");
    setForm({ ...tc, phone });
  };

  const handleFile = (key) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{t("admin.teachers")}</h1>
        <button onClick={() => { setEditing("new"); setForm(blank); }} className="btn-primary">+ Yangi</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((tc) => (
          <div key={tc._id} className="card p-5 text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-3 grid place-items-center text-2xl text-white font-bold overflow-hidden shadow-lg"
                 style={{ background: tc.photo ? "transparent" : "linear-gradient(135deg, #34d399, #059669)" }}>
              {tc.photo
                ? <img src={tc.photo} alt={tc.name} className="w-full h-full object-cover" />
                : tc.name.charAt(0)}
            </div>
            <h3 className="font-bold">{tc.name}</h3>
            <p className="text-sm text-brand-600 mb-1">{tc.subject}</p>
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{tc.bio}</p>
            {tc.certificate && (
              <button onClick={() => setPreviewCert(tc)} className="text-xs text-brand-600 hover:underline mb-3">
                📜 Sertifikatni ko'rish
              </button>
            )}
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={() => startEdit(tc)} className="btn-secondary text-sm">{t("common.edit")}</button>
              <button onClick={() => remove(tc._id)} className="btn-secondary text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl my-8">
            <div className="grid md:grid-cols-[260px_1fr] gap-6">

              <div>
                <input ref={photoInput} type="file" accept="image/*" onChange={handleFile("photo")} className="hidden" />
                <button type="button" onClick={() => photoInput.current?.click()}
                        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-emerald-300 dark:border-emerald-700 grid place-items-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:border-emerald-500 transition group">
                  {form.photo ? (
                    <img src={form.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-16 h-16 rounded-full bg-white/60 grid place-items-center mx-auto mb-3 group-hover:scale-110 transition">
                        <span className="text-3xl text-emerald-600">+</span>
                      </div>
                      <div className="text-xs font-semibold tracking-[0.25em] text-emerald-700 dark:text-emerald-300 mb-2">RASM JOYI</div>
                      <div className="text-xs text-slate-500">+ tugmasini bosib<br/>rasm tanlang</div>
                    </div>
                  )}
                  {form.photo && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition grid place-items-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-semibold text-sm">Rasmni o'zgartirish</span>
                    </div>
                  )}
                </button>
                {form.photo && (
                  <button type="button" onClick={() => setForm({ ...form, photo: "" })}
                          className="mt-2 w-full text-xs text-rose-600 hover:underline">
                    Rasmni olib tashlash
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button type="button" onClick={() => photoInput.current?.click()}
                            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 grid place-items-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">+</button>
                    <span className="text-xs font-semibold tracking-[0.25em] text-emerald-600">O'QITUVCHI</span>
                  </div>
                  <input
                    className="w-full text-2xl md:text-3xl font-bold bg-transparent outline-none border-b border-transparent focus:border-emerald-500 pb-1 placeholder:text-slate-400"
                    placeholder="O'qituvchi ism-familiyasi"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1.5">Fan yo'nalishi</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500"
                      placeholder="Fanni tanlang"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1.5">Telefon raqam</label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm grid place-items-center">+998</div>
                      <input
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500"
                        placeholder="901234567"
                        inputMode="numeric"
                        maxLength={9}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 9) })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-[0.25em] text-emerald-600 block mb-2">QISQACHA MA'LUMOT</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500 resize-none"
                    placeholder="O'qituvchi haqida qisqacha ma'lumot shu yerga yoziladi."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold tracking-[0.25em] text-emerald-600">SERTIFIKATI</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${form.certificate ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {form.certificate ? "Yuklandi" : "Kiritilmagan"}
                    </span>
                  </div>
                  <input ref={certInput} type="file" accept="image/*,application/pdf" onChange={handleFile("certificate")} className="hidden" />
                  {!form.certificate ? (
                    <button type="button" onClick={() => certInput.current?.click()}
                            className="w-full p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 grid place-items-center text-2xl text-emerald-600">+</div>
                      <div>
                        <div className="font-semibold">Sertifikat yuklash</div>
                        <div className="text-xs text-slate-500">PNG, JPG yoki PDF sertifikat yuklang</div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-4">
                      {form.certificate.startsWith("data:image") ? (
                        <img src={form.certificate} alt="cert" className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-rose-100 grid place-items-center text-2xl">📄</div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Sertifikat yuklandi</div>
                        <div className="flex gap-3 mt-1 text-xs">
                          <a href={form.certificate} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Ko'rish</a>
                          <button type="button" onClick={() => certInput.current?.click()} className="text-slate-600 hover:underline">Almashtirish</button>
                          <button type="button" onClick={() => setForm({ ...form, certificate: "" })} className="text-rose-600 hover:underline">O'chirish</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input id="active" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  <label htmlFor="active" className="text-sm">Active</label>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setEditing(null)} className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                    Bekor qilish
                  </button>
                  <button type="submit" className="px-8 py-3 rounded-2xl text-white font-semibold shadow-lg"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {previewCert && (
        <div className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-4" onClick={() => setPreviewCert(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-2xl p-4 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold">{previewCert.name}</div>
                <div className="text-xs text-slate-500">Sertifikat</div>
              </div>
              <button onClick={() => setPreviewCert(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
            </div>
            {previewCert.certificate?.startsWith("data:application/pdf") ? (
              <iframe src={previewCert.certificate} className="w-full h-[70vh] rounded-lg" />
            ) : (
              <img src={previewCert.certificate} alt="" className="w-full max-h-[70vh] object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
