import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios.js";
import TeacherCard from "../components/TeacherCard.jsx";

export default function Teachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/teachers").then((r) => setTeachers(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{t("teachers.title")}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t("teachers.subtitle")}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((tc) => <TeacherCard key={tc._id} teacher={tc} />)}
      </div>
    </div>
  );
}
