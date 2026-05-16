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
    <div className="group relative card overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 transition-all duration-500">
      {/* Card top gradient banner */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: icon.gradient }}
      >
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="w-20 h-20 rounded-3xl bg-white/85 backdrop-blur-md grid place-items-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-500">
          {icon.emoji}
        </div>
        {/* Format badge top-right */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-xs font-semibold text-slate-700 shadow-sm">
          {course.format}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.duration && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              ⏱ {course.duration}
            </span>
          )}
          {course.format && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              {course.format === "online" ? "🌐" : "🏫"} {course.format}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="font-black text-xl gradient-text">
            {course.price ? `${course.price.toLocaleString()} so'm` : "—"}
          </div>
          <Link
            to={`/courses/${course._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors duration-200"
          >
            {t("courses.detail")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
