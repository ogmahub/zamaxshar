import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/index.js";
import { getCourseIcon } from "./courseIcons.js";

export default function CourseCard({ course }) {
  const { t } = useTranslation();
  const lang = i18n.language;
  const title = course[`title${lang[0].toUpperCase() + lang.slice(1)}`] || course.titleUz;
  const icon = getCourseIcon(course.titleUz);

  return (
    <div className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="aspect-video rounded-xl mb-4 grid place-items-center relative overflow-hidden" style={{ background: icon.gradient }}>
        <div className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur grid place-items-center text-4xl shadow-lg">
          {icon.emoji}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 transition">{title}</h3>
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <span className="px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300">{course.duration}</span>
        <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{course.format}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-brand-600">
          {course.price ? `${course.price.toLocaleString()} so'm` : "—"}
        </div>
        <Link to={`/courses/${course._id}`} className="text-sm font-semibold text-brand-600 hover:underline">
          {t("courses.detail")} →
        </Link>
      </div>
    </div>
  );
}
