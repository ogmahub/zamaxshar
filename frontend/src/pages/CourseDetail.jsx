import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios.js";
import i18n from "../i18n/index.js";
import { getCourseIcon } from "../components/courseIcons.js";

export default function CourseDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then((r) => setCourse(r.data)).catch(() => {});
  }, [id]);

  if (!course) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">{t("common.loading")}</div>;
  }

  const lang = i18n.language;
  const title = course[`title${lang[0].toUpperCase() + lang.slice(1)}`] || course.titleUz;
  const description = course[`description${lang[0].toUpperCase() + lang.slice(1)}`] || course.descriptionUz;
  const icon = getCourseIcon(course.titleUz);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-6 md:p-10">
        <div className="aspect-video rounded-2xl mb-8 grid place-items-center relative overflow-hidden" style={{ background: icon.gradient }}>
          <div className="w-32 h-32 rounded-3xl bg-white/80 backdrop-blur grid place-items-center text-7xl shadow-xl">
            {icon.emoji}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 bg-brand-50 dark:bg-brand-500/10 border-brand-200/50">
            <div className="text-xs text-slate-500">{t("courses.price")}</div>
            <div className="text-xl font-bold text-brand-600">{course.price.toLocaleString()} so'm</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500">{t("courses.duration")}</div>
            <div className="text-xl font-bold">{course.duration}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500">{t("courses.format")}</div>
            <div className="text-xl font-bold">{course.format}</div>
          </div>
        </div>

        {course.modules?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">{t("courses.modules")}</h2>
            <ul className="space-y-2">
              {course.modules.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 grid place-items-center text-xs font-bold">{i + 1}</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.results?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">{t("courses.results")}</h2>
            <ul className="space-y-2">
              {course.results.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-brand-600">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/register" state={{ courseId: course._id }} className="btn-primary">
          {t("courses.register")}
        </Link>
      </div>
    </div>
  );
}
