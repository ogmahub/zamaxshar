import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function TeacherDashboard() {
  const { activeSection } = useOutletContext() || { activeSection: "dashboard" };
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentGroupId, setRecentGroupId] = useState(null);
  const groupsSectionRef = useRef(null);
  const [showCert, setShowCert] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ group: "", lessonStartTime: "", lessonEndTime: "" });
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupForm, setGroupForm] = useState({ name: "", lessonStartTime: "", lessonEndTime: "" });

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
    } catch {}
  };

  const loadGroups = async () => {
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch {}
  };

  useEffect(() => {
    if (!user?.id) return;
    loadStudents();
    loadGroups();
  }, [user]);

  const openGroupEditor = (group = null) => {
    setEditingGroup(group);
    setGroupForm(group ? {
      name: group.name || "",
      lessonStartTime: group.lessonStartTime || "",
      lessonEndTime: group.lessonEndTime || ""
    } : { name: "", lessonStartTime: "", lessonEndTime: "" });
    requestAnimationFrame(() => {
      groupsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const closeGroupEditor = () => {
    setEditingGroup(null);
    setGroupForm({ name: "", lessonStartTime: "", lessonEndTime: "" });
  };

  const saveGroup = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        const { data } = await api.put(`/groups/${editingGroup._id}`, groupForm);
        setGroups((list) => list.map((item) => (item._id === data._id ? data : item)));
        setRecentGroupId(data._id);
      } else {
        const { data } = await api.post("/groups", groupForm);
        setGroups((list) => [data, ...list]);
        setRecentGroupId(data._id);
      }
      await loadGroups();
      await loadStudents();
      closeGroupEditor();
      window.setTimeout(() => setRecentGroupId(null), 2000);
      requestAnimationFrame(() => {
        groupsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      alert(err.response?.data?.error || "Xato");
    }
  };

  const removeGroup = async (id) => {
    if (!confirm("Guruh o'chirilsinmi?")) return;
    try {
      await api.delete(`/groups/${id}`);
      setGroups((list) => list.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Xato");
    }
  };

  const openScheduleEditor = (student) => {
    setEditingStudent(student);
    setScheduleForm({
      group: student.group || "",
      lessonStartTime: student.lessonStartTime || "",
      lessonEndTime: student.lessonEndTime || ""
    });
  };

  const closeScheduleEditor = () => {
    setEditingStudent(null);
    setScheduleForm({ group: "", lessonStartTime: "", lessonEndTime: "" });
  };

  const groupMatch = groups.find((group) => group.name === scheduleForm.group);

  const saveSchedule = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/students/teacher/${editingStudent._id}`, scheduleForm);
      setStudents((list) => list.map((item) => (item._id === data._id ? data : item)));
      closeScheduleEditor();
    } catch (err) {
      alert(err.response?.data?.error || "Xato");
    }
  };

  if (!user) return null;

  const showDashboard = activeSection === "dashboard";
  const showGroups = activeSection === "groups";
  const showStudents = activeSection === "students";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">O'qituvchi paneli</h1>

      {showDashboard && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-5 sm:p-6">
              <div className="absolute right-5 top-5 text-slate-300 dark:text-slate-600 text-2xl">→</div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-2xl shadow-lg shadow-violet-500/20">
                🎓
              </div>
              <div className="mt-8 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {students.length}
              </div>
              <div className="mt-3 text-lg text-slate-500 dark:text-slate-400">
                Jami talabalar
              </div>
            </div>
          </div>

          <div id="teacher-profile" className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-500 grid place-items-center text-2xl text-white font-bold flex-shrink-0">
                {user.photo ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" /> : (user.name || "?").charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="text-sm text-indigo-600 font-medium">{user.subject}</div>
                {user.bio && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{user.bio}</p>}
              </div>
              {user.certificate && (
                <button
                  onClick={() => setShowCert(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition"
                >
                  <span className="text-lg">🎓</span> Sertifikatni ko'rish
                </button>
              )}
            </div>
            {!user.certificate && (
              <div className="mt-3 text-xs text-slate-500">
                Sertifikat hali yuklanmagan. Super admin profil bo'limidan sertifikat yuklab beradi.
              </div>
            )}
          </div>
        </>
      )}

      {showGroups && (
        <div id="teacher-groups" ref={groupsSectionRef} className="card p-4 sm:p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guruhlar</h2>
            <p className="text-sm text-slate-500 mt-1">Jami: {groups.length} ta guruh</p>
          </div>

          <div className="rounded-3xl bg-slate-50/70 dark:bg-slate-900/50 p-4 sm:p-5 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingGroup ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">Guruh nomi va dars vaqtlarini kiriting, keyin yaratish tugmasini bosing.</p>
            </div>

            <form onSubmit={saveGroup} className="grid md:grid-cols-[1.3fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                <label className="label block mb-1">Guruh nomi</label>
                <input
                  className="input"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label block mb-1">Boshlanish vaqti</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="input"
                  value={groupForm.lessonStartTime}
                  onChange={(e) => setGroupForm((s) => ({ ...s, lessonStartTime: e.target.value }))}
                />
              </div>
              <div>
                <label className="label block mb-1">Tugash vaqti</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="input"
                  value={groupForm.lessonEndTime}
                  onChange={(e) => setGroupForm((s) => ({ ...s, lessonEndTime: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                {editingGroup && (
                  <button type="button" onClick={closeGroupEditor} className="btn-secondary">Bekor</button>
                )}
                <button type="submit" className="btn-primary">{editingGroup ? "Saqlash" : "Yaratish"}</button>
              </div>
            </form>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-slate-500 sm:col-span-2 xl:col-span-3">Hozircha guruh yo'q.</div>
            ) : groups.map((group) => {
              const studentsInGroup = students.filter((student) => student.group === group.name).length;
              return (
                <div key={group._id} className={`rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-900/50 shadow-sm transition ${recentGroupId === group._id ? "ring-2 ring-emerald-200 dark:ring-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-base">{group.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{group.lessonStartTime} - {group.lessonEndTime}</div>
                    </div>
                    {recentGroupId === group._id && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Yangi
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                      {studentsInGroup} ta
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={() => openGroupEditor(group)} className="text-sm font-medium text-brand-600 hover:underline">Tahrirlash</button>
                    <button type="button" onClick={() => removeGroup(group._id)} className="text-sm font-medium text-rose-600 hover:underline">O'chirish</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showStudents && (
        <div id="teacher-students" className="card p-6">
          <h2 className="text-lg font-bold mb-4">Mening talabalarim ({students.length})</h2>
          {students.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Hozircha biriktirilgan talaba yo'q.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Ism</th>
                    <th className="px-4 py-3 text-left">Login</th>
                    <th className="px-4 py-3 text-left">Telefon</th>
                    <th className="px-4 py-3 text-left">Kurs</th>
                    <th className="px-4 py-3 text-left">Guruh</th>
                    <th className="px-4 py-3 text-left">Dars vaqti</th>
                    <th className="px-4 py-3 text-left">To'lov</th>
                    <th className="px-4 py-3 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium">{s.firstName} {s.lastName}</td>
                      <td className="px-4 py-3">{s.username}</td>
                      <td className="px-4 py-3">{s.phone || "—"}</td>
                      <td className="px-4 py-3">{s.course?.titleUz || "—"}</td>
                      <td className="px-4 py-3">{s.group || "—"}</td>
                      <td className="px-4 py-3">{s.lessonStartTime && s.lessonEndTime ? `${s.lessonStartTime} - ${s.lessonEndTime}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                          s.paymentStatus === "expired" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{s.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openScheduleEditor(s)} className="text-brand-600 hover:underline text-xs font-medium">
                          Tahrirlash
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showCert && user.certificate && (
        <div
          onClick={() => setShowCert(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
              <div className="font-bold">Sertifikat — {user.name}</div>
              <div className="flex gap-2">
                <a href={user.certificate} download={`sertifikat_${user.name}.png`} className="text-sm px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Yuklab olish</a>
                <button onClick={() => setShowCert(false)} className="text-sm px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold">Yopish</button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-60px)] grid place-items-center bg-slate-100 dark:bg-slate-950">
              {user.certificate.startsWith("data:application/pdf") || user.certificate.endsWith(".pdf") ? (
                <iframe src={user.certificate} title="Sertifikat" className="w-full h-[80vh] rounded-lg bg-white" />
              ) : (
                <img src={user.certificate} alt="Sertifikat" className="max-w-full max-h-[80vh] rounded-lg shadow" />
              )}
            </div>
          </div>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeScheduleEditor}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={saveSchedule} className="card w-full max-w-md p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold">Guruh va dars vaqtini tahrirlash</h3>
              <p className="text-sm text-slate-500 mt-1">{editingStudent.firstName} {editingStudent.lastName}</p>
            </div>

            <div>
              <label className="label block mb-1">Guruh</label>
              <input
                list="teacher-group-options"
                className="input"
                value={scheduleForm.group}
                onChange={(e) => {
                  const value = e.target.value;
                  const matched = groups.find((group) => group.name === value);
                  setScheduleForm((s) => ({
                    ...s,
                    group: value,
                    ...(matched ? {
                      lessonStartTime: matched.lessonStartTime,
                      lessonEndTime: matched.lessonEndTime
                    } : {})
                  }));
                }}
              />
              {groupMatch && (
                <div className="mt-1 text-xs text-slate-500">Tanlangan guruh vaqti: {groupMatch.lessonStartTime} - {groupMatch.lessonEndTime}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Boshlanish</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="input"
                  value={scheduleForm.lessonStartTime}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, lessonStartTime: e.target.value }))}
                />
              </div>
              <div>
                <label className="label block mb-1">Tugash</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  className="input"
                  value={scheduleForm.lessonEndTime}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, lessonEndTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={closeScheduleEditor} className="btn-secondary">Bekor</button>
              <button type="submit" className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      <datalist id="teacher-group-options">
        {groups.map((group) => (
          <option key={group._id} value={group.name} />
        ))}
      </datalist>
    </div>
  );
}
