import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{t("courses.title")}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t("courses.subtitle")}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => <CourseCard key={c._id} course={c} />)}
      </div>
      {courses.length === 0 && (
        <div className="text-center text-slate-500 py-16">{t("common.noData")}</div>
      )}
    </div>
  );
}
