import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Contact() {
  const contacts = [
    {
      icon: "📞",
      label: "Telefon",
      value: "+998 90 893 00 02",
      href: "tel:+998908930002",
      color: "from-brand-400 to-brand-600",
    },
    {
      icon: "✈️",
      label: "Telegram",
      value: "@zamaxshar_admin",
      href: "https://t.me/zamaxshar_admin",
      color: "from-sky-400 to-blue-600",
    },
    {
      icon: "📍",
      label: "Manzil",
      value: "Qashqadaryo, Qamashi tumani, Amir Temur ko'chasi",
      href: null,
      color: "from-violet-400 to-violet-600",
    },
    {
      icon: "🕐",
      label: "Ish vaqti",
      value: "Du–Sha: 09:00 – 18:00",
      href: null,
      color: "from-amber-400 to-orange-500",
    },
  ];

  const socials = [
    { label: "Instagram", href: "https://instagram.com/zamaxshar_tm", icon: "📸", bg: "linear-gradient(135deg, #feda75 0%, #d62976 50%, #4f5bd5 100%)" },
    { label: "Telegram", href: "https://t.me/Zamaxshar_TM", icon: "✈️", bg: "linear-gradient(135deg, #37bbfe, #007dbb)" },
    { label: "YouTube", href: "https://youtube.com/@zamaxshar", icon: "▶️", bg: "linear-gradient(135deg, #ff4444, #cc0000)" },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-brand-400/10 dark:bg-brand-500/6 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Bog'lanish</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
            Aloqa ma'lumotlari
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Savol, taklif yoki hamkorlik uchun biz bilan bog'laning
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {contacts.map((c, i) => (
            <motion.div
              key={c.label}
              initial="hidden"
              animate="visible"
              custom={i}
              variants={fadeUp}
            >
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="card p-6 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 transition-all duration-500 block"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {c.icon}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm leading-relaxed">{c.value}</p>
                </a>
              ) : (
                <div className="card p-6 group hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {c.icon}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-relaxed">{c.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Social links */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
            Ijtimoiy tarmoqlar
          </p>
          <div className="flex items-center justify-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{ background: s.bg }}
                className="w-14 h-14 rounded-3xl grid place-items-center text-2xl shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
