import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const WEEKDAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
const WEEKDAY_PRESETS = [
  { label: "Du/Chor/Ju", days: ["Dushanba", "Chorshanba", "Juma"] },
  { label: "Se/Pay/Sha", days: ["Seshanba", "Payshanba", "Shanba"] },
];

const STATUS_COLORS = {
  new: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  converted_to_student: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const addDaysISO = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export default function Applications() {
  const { t } = useTranslation();
  const [apps, setApps] = useState([]);
  const [convertId, setConvertId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [subjectTeachers, setSubjectTeachers] = useState({});
  const [convertForm, setConvertForm] = useState({ password: "12345", enrollments: [] });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    selectedSubjects: [],
    course: "",
    studyMode: "offline",
    startDate: "",
    validUntil: "",
    username: "",
    passwordPlain: "",
    message: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get("/applications");
      setApps(data);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (app) => {
    setEditId(app._id);
    const start = app.startDate ? String(app.startDate).slice(0, 10) : todayISO();
    const end = app.validUntil ? String(app.validUntil).slice(0, 10) : addDaysISO(start, 30);
    setEditForm({
      firstName: app.firstName || "",
      lastName: app.lastName || "",
      phone: app.phone || "",
      selectedSubjects: app.selectedSubjects || [],
      course: app.course?._id || "",
      studyMode: app.studyMode || "offline",
      startDate: start,
      validUntil: end,
      username: app.username || "",
      passwordPlain: app.passwordPlain || "",
      message: app.message || "",
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${editId}`, editForm);
      toast.success("Ariza yangilandi");
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  const openConvert = async (app) => {
    const start = todayISO();
    const subjects = app.selectedSubjects?.length
      ? app.selectedSubjects
      : (app.course?.titleUz ? [app.course.titleUz] : []);
    const enrollments = subjects.map((subject) => ({
      subject,
      teacher: "",
      group: "",
      weekdays: [],
      lessonStartTime: "",
      lessonEndTime: "",
      validFrom: start,
      validUntil: addDaysISO(start, 30),
    }));
    setConvertId(app._id);
    setConvertForm({ password: app.passwordPlain || "12345", enrollments });
    try {
      const { data: allTeachers } = await api.get("/teachers");
      const norm = (s) => String(s || "").trim().toLowerCase();
      const map = {};
      subjects.forEach((subj) => {
        map[subj] = allTeachers.filter((tc) =>
          norm(tc.subject).includes(norm(subj)) || norm(subj).includes(norm(tc.subject))
        );
      });
      setSubjectTeachers(map);
    } catch {
      const empty = {};
      subjects.forEach((s) => { empty[s] = []; });
      setSubjectTeachers(empty);
    }
  };

  const updateEnrollment = (idx, field, value) => {
    setConvertForm((s) => ({
      ...s,
      enrollments: s.enrollments.map((en, i) => i === idx ? { ...en, [field]: value } : en),
    }));
  };

  const toggleWeekday = (idx, day) => {
    setConvertForm((s) => ({
      ...s,
      enrollments: s.enrollments.map((en, i) => {
        if (i !== idx) return en;
        const days = en.weekdays.includes(day)
          ? en.weekdays.filter((d) => d !== day)
          : [...en.weekdays, day];
        return { ...en, weekdays: days };
      }),
    }));
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success("Status yangilandi");
      load();
    } catch {
      toast.error("Xato");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success("O'chirildi");
      load();
    } catch {
      toast.error("Xato");
    }
  };

  const convert = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/applications/${convertId}/convert`, convertForm);
      toast.success("Student yaratildi");
      setConvertId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Xato");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("admin.applications")}</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Ism</th>
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-left">Fanlar</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{a.firstName} {a.lastName}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">
                    {a.selectedSubjects?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {a.selectedSubjects.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">{a.course?.titleUz || "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{a.studyMode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                      {t(`status.${a.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(a)} className="text-brand-600 hover:underline">Tahrirlash</button>
                    {a.status === "new" && (
                      <>
                        <button onClick={() => updateStatus(a._id, "accepted")} className="text-emerald-600 hover:underline">Qabul</button>
                        <button onClick={() => updateStatus(a._id, "rejected")} className="text-rose-600 hover:underline">Rad</button>
                      </>
                    )}
                    {a.status === "accepted" && (
                      <button
                        onClick={() => openConvert(a)}
                        className="text-violet-600 hover:underline"
                      >
                        → Student
                      </button>
                    )}
                    <button onClick={() => remove(a._id)} className="text-slate-500 hover:text-rose-600">🗑</button>
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">{t("common.noData")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editId && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" onClick={() => setEditId(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submitEdit} className="card p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">Tahrirlash</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Ism</label>
                <input className="input" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
              </div>
              <div>
                <label className="label block mb-1">Familiya</label>
                <input className="input" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
              </div>
              <div>
                <label className="label block mb-1">Telefon</label>
                <input className="input" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label block mb-1">Tanlangan fanlar</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-[2.5rem]">
                  {editForm.selectedSubjects?.length > 0
                    ? editForm.selectedSubjects.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold">{s}</span>
                      ))
                    : <span className="text-slate-400 text-sm">—</span>
                  }
                </div>
              </div>
              <div>
                <label className="label block mb-1">Format</label>
                <select className="input" value={editForm.studyMode} onChange={(e) => setEditForm({ ...editForm, studyMode: e.target.value })}>
                  <option value="offline">offline</option>
                  <option value="online">online</option>
                </select>
              </div>
              <div>
                <label className="label block mb-1">Boshlanish sanasi</label>
                <input
                  type="date"
                  className="input"
                  value={editForm.startDate}
                  onChange={(e) => {
                    const start = e.target.value;
                    setEditForm((s) => ({
                      ...s,
                      startDate: start,
                      validUntil: start ? addDaysISO(start, 30) : s.validUntil
                    }));
                  }}
                />
              </div>
              <div>
                <label className="label block mb-1">Tugash sanasi</label>
                <input
                  type="date"
                  className="input"
                  value={editForm.validUntil}
                  onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value })}
                />
              </div>
              <div>
                <label className="label block mb-1">Login (Username)</label>
                <input
                  className="input"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                />
              </div>
              <div>
                <label className="label block mb-1">Parol</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.passwordPlain}
                  onChange={(e) => setEditForm({ ...editForm, passwordPlain: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label block mb-1">Izoh</label>
              <textarea className="input resize-none" rows={4} value={editForm.message} onChange={(e) => setEditForm({ ...editForm, message: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditId(null)} className="btn-secondary">Bekor</button>
              <button type="submit" className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      {convertId && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" onClick={() => setConvertId(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={convert} className="card p-6 w-full max-w-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">Studentga aylantirish</h3>

            <div>
              <label className="label block mb-1">Parol</label>
              <input className="input" required value={convertForm.password} onChange={(e) => setConvertForm((s) => ({ ...s, password: e.target.value }))} />
            </div>

            {convertForm.enrollments.map((en, idx) => (
              <div key={en.subject} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold grid place-items-center shrink-0">{idx + 1}</span>
                  <span className="font-semibold text-brand-700 dark:text-brand-300">{en.subject}</span>
                </div>

                <div>
                  <label className="label block mb-1">Ustoz</label>
                  <select className="input" value={en.teacher} onChange={(e) => updateEnrollment(idx, "teacher", e.target.value)}>
                    <option value="">— Tanlang —</option>
                    {(subjectTeachers[en.subject] || []).map((tc) => (
                      <option key={tc._id} value={tc._id}>{tc.name}{tc.subject ? ` (${tc.subject})` : ""}</option>
                    ))}
                  </select>
                  {!(subjectTeachers[en.subject]?.length) && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Bu fan bo'yicha faol ustoz topilmadi.</p>
                  )}
                </div>

                <div>
                  <label className="label block mb-1">Guruh</label>
                  <input className="input" placeholder="1-guruh" value={en.group} onChange={(e) => updateEnrollment(idx, "group", e.target.value)} />
                </div>

                <div>
                  <label className="label block mb-2">Hafta kunlari</label>
                  <div className="flex gap-2 mb-2">
                    {WEEKDAY_PRESETS.map((p) => (
                      <button key={p.label} type="button"
                        onClick={() => updateEnrollment(idx, "weekdays", p.days)}
                        className={`px-3 py-1 text-xs rounded-full border font-medium transition-all ${
                          JSON.stringify(en.weekdays) === JSON.stringify(p.days)
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400"
                        }`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((day) => (
                      <button key={day} type="button"
                        onClick={() => toggleWeekday(idx, day)}
                        className={`px-2.5 py-1 text-xs rounded-full border font-medium transition-all ${
                          en.weekdays.includes(day)
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400"
                        }`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1">Boshlanish vaqti</label>
                    <input type="text" inputMode="numeric" maxLength={5} placeholder="14:00" className="input" value={en.lessonStartTime} onChange={(e) => updateEnrollment(idx, "lessonStartTime", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Tugash vaqti</label>
                    <input type="text" inputMode="numeric" maxLength={5} placeholder="16:00" className="input" value={en.lessonEndTime} onChange={(e) => updateEnrollment(idx, "lessonEndTime", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1">Boshlanish sanasi</label>
                    <input type="date" className="input" value={en.validFrom}
                      onChange={(e) => {
                        const d = e.target.value;
                        updateEnrollment(idx, "validFrom", d);
                        if (d) updateEnrollment(idx, "validUntil", addDaysISO(d, 30));
                      }} />
                  </div>
                  <div>
                    <label className="label block mb-1">Tugash sanasi</label>
                    <input type="date" className="input" value={en.validUntil} onChange={(e) => updateEnrollment(idx, "validUntil", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setConvertId(null)} className="btn-secondary">Bekor</button>
              <button type="submit" className="btn-primary">Yaratish</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
