import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const PAYMENT_COLORS = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  unpaid: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  expired: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
};
const PAYMENT_LABELS = { paid: "To'langan", unpaid: "To'lanmagan", expired: "Muddati tugagan" };
const WEEKDAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

const toISODate = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };

const makeBlank = () => ({ firstName: "", lastName: "", username: "", phone: "", password: "", enrollments: [] });
const blank = makeBlank();

const blankEnrollment = () => {
  const today = new Date();
  return {
    course: "", teacher: "", group: "",
    lessonStartTime: "", lessonEndTime: "",
    weekdays: [],
    paymentStatus: "unpaid",
    validFrom: toISODate(today),
    validUntil: toISODate(addDays(today, 30)),
    status: "active"
  };
};

export default function StudentsAdmin() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const paymentFilter = searchParams.get("payment");
  const filteredItems = paymentFilter ? items.filter((student) => student.paymentStatus === paymentFilter) : items;
  const canSeePasswords = user?.role === "admin" || !!user?.isSuperAdmin;

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
      const isNew = editing === "new";
      if (!isNew && !payload.password) delete payload.password;
      if (!isNew && !payload.phone) delete payload.phone;
      if (!isNew) await api.put(`/students/${editing}`, payload);
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

  const copyPassword = async (password = "") => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Parol nusxalandi");
    } catch {
      toast.error("Parolni nusxalab bo'lmadi");
    }
  };

  const addEnrollment = () => setForm((f) => ({ ...f, enrollments: [...f.enrollments, blankEnrollment()] }));
  const removeEnrollment = (idx) => setForm((f) => ({ ...f, enrollments: f.enrollments.filter((_, i) => i !== idx) }));
  const updateEnrollment = (idx, key, val) => setForm((f) => {
    const updated = [...f.enrollments];
    updated[idx] = { ...updated[idx], [key]: val };
    return { ...f, enrollments: updated };
  });

  const startEdit = (s) => {
    setEditing(s._id);
    const existingEnrollments = (s.enrollments || []).map((e) => ({
      course: e.course?._id || e.course || "",
      teacher: e.teacher?._id || e.teacher || "",
      group: e.group || "",
      lessonStartTime: e.lessonStartTime || "",
      lessonEndTime: e.lessonEndTime || "",
      weekdays: Array.isArray(e.weekdays) ? e.weekdays : [],
      paymentStatus: e.paymentStatus || "unpaid",
      validFrom: e.validFrom ? e.validFrom.slice(0, 10) : toISODate(new Date()),
      validUntil: e.validUntil ? e.validUntil.slice(0, 10) : toISODate(addDays(new Date(), 30)),
      status: e.status || "active"
    }));
    const legacyEnrollment = (s.course || s.teacher || s.group) && existingEnrollments.length === 0
      ? [{
          course: s.course?._id || s.course || "",
          teacher: s.teacher?._id || s.teacher || "",
          group: s.group || "",
          lessonStartTime: s.lessonStartTime || "",
          lessonEndTime: s.lessonEndTime || "",
          weekdays: Array.isArray(s.groupWeekdays) ? s.groupWeekdays : [],
          paymentStatus: s.paymentStatus || "unpaid",
          validFrom: s.validFrom ? s.validFrom.slice(0, 10) : toISODate(new Date()),
          validUntil: s.validUntil ? s.validUntil.slice(0, 10) : toISODate(addDays(new Date(), 30)),
          status: "active"
        }]
      : existingEnrollments;
    setForm({
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      username: s.username || "",
      phone: s.phone || "",
      password: s.passwordPlain || "",
      enrollments: legacyEnrollment
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{t("admin.students")}</h1>
        <button onClick={() => { setEditing("new"); setForm(makeBlank()); }} className="btn-primary">+ Yangi</button>
      </div>

      {paymentFilter && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium">
            {paymentFilter === "paid" ? "To'langan talabalar" : paymentFilter === "unpaid" ? "To'lanmagan talabalar" : paymentFilter}
          </span>
          <span className="text-slate-500">({filteredItems.length})</span>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Talaba</th>
                <th className="px-4 py-3 text-left">Login</th>
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-left">Fanlar</th>
                {canSeePasswords && <th className="px-4 py-3 text-left">Parol</th>}
                <th className="px-4 py-3 text-left">To'lov</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((s) => {
                const enrollCount = s.enrollments?.length || 0;
                const firstCourse = enrollCount > 0
                  ? s.enrollments[0].course?.titleUz
                  : s.course?.titleUz;
                const payStatus = enrollCount > 0
                  ? s.enrollments[0].paymentStatus
                  : s.paymentStatus;
                return (
                  <tr key={s._id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">{s.username}</td>
                    <td className="px-4 py-3">{s.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {enrollCount > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] grid place-items-center font-bold">{enrollCount}</span>
                          <span className="text-slate-600 dark:text-slate-400 text-xs truncate max-w-[120px]">{firstCourse || "Fan"}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">{firstCourse || "—"}</span>
                      )}
                    </td>
                    {canSeePasswords && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{s.passwordPlain || "—"}</span>
                          {s.passwordPlain && (
                            <button type="button" onClick={() => copyPassword(s.passwordPlain)}
                              className="text-xs text-brand-600 hover:underline">Nusxa</button>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[payStatus]}`}>
                        {PAYMENT_LABELS[payStatus] || payStatus || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => startEdit(s)} className="text-brand-600 hover:underline text-xs font-medium">Tahrirlash</button>
                      <button onClick={() => remove(s._id)} className="text-slate-400 hover:text-rose-600 transition-colors">🗑</button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr><td colSpan={canSeePasswords ? 7 : 6} className="px-4 py-10 text-center text-slate-500">{t("common.noData")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="card p-0 w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold">{editing === "new" ? "Yangi talaba qo'shish" : "Talabani tahrirlash"}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Shaxsiy ma'lumotlar va fanlar jadvali</p>
              </div>
              <button type="button" onClick={() => setEditing(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* ─── Section 1: Shaxsiy ma'lumotlar ─── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center text-xs font-bold">1</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Shaxsiy ma'lumotlar</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1">Ism <span className="text-rose-500">*</span></label>
                    <input className="input" required value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="label block mb-1">Familiya</label>
                    <input className="input" value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <div>
                    <label className="label block mb-1">Login <span className="text-rose-500">*</span></label>
                    <input className="input font-mono" required placeholder="masalan: 9999"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })} />
                  </div>
                  <div>
                    <label className="label block mb-1">
                      Parol {editing !== "new" && <span className="text-xs text-slate-400">(o'zgartirmasangiz bo'sh qoldiring)</span>}
                    </label>
                    <input type="text" className="input font-mono" required={editing === "new"}
                      placeholder={editing === "new" ? "masalan: 8888" : ""}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label block mb-1">Telefon</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-brand-600 text-white font-semibold text-sm pointer-events-none">+998</span>
                      <input className="input pl-20" inputMode="numeric" maxLength={9} placeholder="901234567"
                        value={(form.phone || "").replace(/^\+998/, "")}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                          setForm({ ...form, phone: digits ? `+998${digits}` : "" });
                        }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Divider ─── */}
              <div className="border-t border-slate-200 dark:border-slate-700" />

              {/* ─── Section 2: Fanlar va jadval ─── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center text-xs font-bold">2</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Fanlar va jadval
                      {form.enrollments.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold normal-case">
                          {form.enrollments.length} ta
                        </span>
                      )}
                    </span>
                  </div>
                  <button type="button" onClick={addEnrollment}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-sm">
                    + Fan qo'shish
                  </button>
                </div>

                {form.enrollments.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <p className="text-sm font-medium text-slate-500">Hali fan qo'shilmagan</p>
                    <p className="text-xs text-slate-400 mt-1">Yuqoridagi "Fan qo'shish" tugmasini bosing</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.enrollments.map((en, idx) => (
                      <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                        {/* Enrollment header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-brand-50 dark:bg-brand-500/10 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-brand-600 text-white grid place-items-center text-[10px]">{idx + 1}</span>
                            Fan #{idx + 1}
                          </span>
                          <button type="button" onClick={() => removeEnrollment(idx)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium hover:underline">
                            O'chirish
                          </button>
                        </div>

                        <div className="p-4 grid sm:grid-cols-2 gap-3">
                          {/* Kurs */}
                          <div>
                            <label className="label block mb-1 text-xs">Kurs</label>
                            <select className="input text-sm" value={en.course}
                              onChange={(e) => updateEnrollment(idx, "course", e.target.value)}>
                              <option value="">— Kurs tanlang —</option>
                              {courses.map((c) => <option key={c._id} value={c._id}>{c.titleUz}</option>)}
                            </select>
                          </div>

                          {/* Ustoz */}
                          <div>
                            <label className="label block mb-1 text-xs">Ustoz</label>
                            <select className="input text-sm" value={en.teacher}
                              onChange={(e) => updateEnrollment(idx, "teacher", e.target.value)}>
                              <option value="">— Ustoz tanlang —</option>
                              {teachers.map((tc) => <option key={tc._id} value={tc._id}>{tc.name}</option>)}
                            </select>
                          </div>

                          {/* Guruh */}
                          <div>
                            <label className="label block mb-1 text-xs">Guruh</label>
                            <input className="input text-sm" placeholder="masalan: 1-guruh"
                              value={en.group}
                              onChange={(e) => updateEnrollment(idx, "group", e.target.value)} />
                          </div>

                          {/* To'lov holati */}
                          <div>
                            <label className="label block mb-1 text-xs">To'lov holati</label>
                            <select className="input text-sm" value={en.paymentStatus}
                              onChange={(e) => updateEnrollment(idx, "paymentStatus", e.target.value)}>
                              <option value="unpaid">To'lanmagan</option>
                              <option value="paid">To'langan</option>
                              <option value="expired">Muddati tugagan</option>
                            </select>
                          </div>

                          {/* Dars vaqti */}
                          <div>
                            <label className="label block mb-1 text-xs">Boshlanish vaqti</label>
                            <input className="input text-sm font-mono" placeholder="08:00"
                              value={en.lessonStartTime}
                              onChange={(e) => updateEnrollment(idx, "lessonStartTime", e.target.value)} />
                          </div>
                          <div>
                            <label className="label block mb-1 text-xs">Tugash vaqti</label>
                            <input className="input text-sm font-mono" placeholder="10:00"
                              value={en.lessonEndTime}
                              onChange={(e) => updateEnrollment(idx, "lessonEndTime", e.target.value)} />
                          </div>

                          {/* To'lov sanasi */}
                          <div>
                            <label className="label block mb-1 text-xs">To'lov boshlanish</label>
                            <input type="date" className="input text-sm" value={en.validFrom}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateEnrollment(idx, "validFrom", v);
                                if (v) updateEnrollment(idx, "validUntil", toISODate(addDays(v, 30)));
                              }} />
                          </div>
                          <div>
                            <label className="label block mb-1 text-xs">To'lov tugash</label>
                            <input type="date" className="input text-sm" value={en.validUntil}
                              onChange={(e) => updateEnrollment(idx, "validUntil", e.target.value)} />
                          </div>

                          {/* Hafta kunlari */}
                          <div className="sm:col-span-2">
                            <label className="label block mb-2 text-xs">Hafta kunlari</label>
                            <div className="flex flex-wrap gap-2">
                              {WEEKDAYS.map((day) => {
                                const active = (en.weekdays || []).includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      const curr = en.weekdays || [];
                                      updateEnrollment(idx, "weekdays",
                                        active ? curr.filter((d) => d !== day) : [...curr, day]
                                      );
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                      active
                                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                                        : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:text-brand-600"
                                    }`}
                                  >
                                    {day.slice(0, 2)}
                                  </button>
                                );
                              })}
                            </div>
                            {(en.weekdays || []).length > 0 && (
                              <p className="text-xs text-slate-400 mt-1.5">
                                {(en.weekdays).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900 rounded-b-2xl">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Bekor qilish</button>
              <button type="submit" className="btn-primary px-6">Saqlash</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
