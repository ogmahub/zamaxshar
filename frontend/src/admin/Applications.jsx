import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const STATUS_COLORS = {
  new: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  converted_to_student: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
};

export default function Applications() {
  const { t } = useTranslation();
  const [apps, setApps] = useState([]);
  const [convertId, setConvertId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [convertForm, setConvertForm] = useState({ password: "12345", teacher: "", validFrom: "", validUntil: "" });

  const load = async () => {
    try {
      const { data } = await api.get("/applications");
      setApps(data);
    } catch {}
  };

  useEffect(() => {
    load();
    api.get("/teachers").then((r) => setTeachers(r.data)).catch(() => {});
  }, []);

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
                <th className="px-4 py-3 text-left">Kurs</th>
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
                  <td className="px-4 py-3">{a.course?.titleUz || "—"}</td>
                  <td className="px-4 py-3">{a.studyMode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                      {t(`status.${a.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {a.status === "new" && (
                      <>
                        <button onClick={() => updateStatus(a._id, "accepted")} className="text-emerald-600 hover:underline">Qabul</button>
                        <button onClick={() => updateStatus(a._id, "rejected")} className="text-rose-600 hover:underline">Rad</button>
                      </>
                    )}
                    {a.status === "accepted" && (
                      <button onClick={() => { setConvertId(a._id); setConvertForm({ password: "12345", teacher: "", validFrom: new Date().toISOString().slice(0,10), validUntil: "" }); }} className="text-violet-600 hover:underline">→ Student</button>
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

      {convertId && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" onClick={() => setConvertId(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={convert} className="card p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Studentga aylantirish</h3>
            <div>
              <label className="label block mb-1">Parol</label>
              <input className="input" required value={convertForm.password} onChange={(e) => setConvertForm({ ...convertForm, password: e.target.value })} />
            </div>
            <div>
              <label className="label block mb-1">Ustoz</label>
              <select className="input" required value={convertForm.teacher} onChange={(e) => setConvertForm({ ...convertForm, teacher: e.target.value })}>
                <option value="">—</option>
                {teachers.map((tc) => <option key={tc._id} value={tc._id}>{tc.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Boshlanish</label>
                <input type="date" className="input" value={convertForm.validFrom} onChange={(e) => setConvertForm({ ...convertForm, validFrom: e.target.value })} />
              </div>
              <div>
                <label className="label block mb-1">Tugash</label>
                <input type="date" className="input" value={convertForm.validUntil} onChange={(e) => setConvertForm({ ...convertForm, validUntil: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setConvertId(null)} className="btn-secondary">Bekor</button>
              <button type="submit" className="btn-primary">Yaratish</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
