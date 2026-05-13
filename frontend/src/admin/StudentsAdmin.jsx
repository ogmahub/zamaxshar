import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const PAYMENT_COLORS = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  unpaid: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  expired: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
};

const toISODate = (d) => d.toISOString().slice(0, 10);
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
const makeBlank = () => {
  const today = new Date();
  return {
    firstName: "", lastName: "", phone: "", password: "", course: "", teacher: "",
    paymentStatus: "unpaid",
    validFrom: toISODate(today),
    validUntil: toISODate(addDays(today, 30))
  };
};
const blank = makeBlank();

export default function StudentsAdmin() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const load = async () => {
    try { setItems((await api.get("/students")).data); } catch {}
  };

  useEffect(() => {
    load();
    api.get("/courses").then((r) => setCourses(r.data));
    api.get("/teachers").then((r) => setTeachers(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) await api.put(`/students/${editing}`, payload);
      else await api.post("/students", payload);
      toast.success("Saqlandi");
      setEditing(null); setForm(blank); load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await api.delete(`/students/${id}`); load(); } catch {}
  };

  const startEdit = (s) => {
    setEditing(s._id);
    setForm({
      firstName: s.firstName, lastName: s.lastName || "", phone: s.phone, password: "",
      course: s.course?._id || "", teacher: s.teacher?._id || "",
      paymentStatus: s.paymentStatus,
      validFrom: s.validFrom ? s.validFrom.slice(0, 10) : "",
      validUntil: s.validUntil ? s.validUntil.slice(0, 10) : ""
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{t("admin.students")}</h1>
        <button onClick={() => { setEditing("new"); setForm(makeBlank()); }} className="btn-primary">+ Yangi</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Ism</th>
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-left">Kurs</th>
                <th className="px-4 py-3 text-left">Ustoz</th>
                <th className="px-4 py-3 text-left">To'lov</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.course?.titleUz || "—"}</td>
                  <td className="px-4 py-3">{s.teacher?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[s.paymentStatus]}`}>
                      {t(`status.${s.paymentStatus}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => startEdit(s)} className="text-brand-600 hover:underline">{t("common.edit")}</button>
                    <button onClick={() => remove(s._id)} className="text-slate-500 hover:text-rose-600">🗑</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">{t("common.noData")}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">{editing === "new" ? "Yangi student" : "Tahrirlash"}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className="label block mb-1">Ism</label><input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
              <div><label className="label block mb-1">Familiya</label><input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              <div>
                <label className="label block mb-1">Telefon</label>
                <div className="flex">
                  <span className="px-3 grid place-items-center rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-semibold text-sm text-slate-600 dark:text-slate-300">+998</span>
                  <input
                    className="input rounded-l-none flex-1"
                    required
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="901234567"
                    value={form.phone.replace(/^\+998/, "")}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setForm({ ...form, phone: digits ? `+998${digits}` : "" });
                    }}
                  />
                </div>
              </div>
              <div><label className="label block mb-1">Parol {editing !== "new" && <span className="text-xs text-slate-400">(bo'sh qoldirish mumkin)</span>}</label><input type="text" className="input" required={editing === "new"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <div>
                <label className="label block mb-1">Kurs</label>
                <select className="input" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                  <option value="">—</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.titleUz}</option>)}
                </select>
              </div>
              <div>
                <label className="label block mb-1">Ustoz</label>
                <select className="input" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}>
                  <option value="">—</option>
                  {teachers.map((tc) => <option key={tc._id} value={tc._id}>{tc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label block mb-1">To'lov</label>
                <select className="input" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
                  <option value="unpaid">unpaid</option>
                  <option value="paid">paid</option>
                  <option value="expired">expired</option>
                </select>
              </div>
              <div>
                <label className="label block mb-1">Boshlanish</label>
                <input type="date" className="input" value={form.validFrom}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((s) => ({ ...s, validFrom: v, validUntil: v ? toISODate(addDays(v, 30)) : s.validUntil }));
                  }} />
              </div>
              <div>
                <label className="label block mb-1">Tugash <span className="text-xs text-slate-400">(boshlanishdan +30 kun)</span></label>
                <input type="date" className="input" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
              </div>
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
