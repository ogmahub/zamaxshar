import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CARD_LAYOUT = {
  ring: {
    phone: "bg-emerald-500/10",
    telegram: "bg-sky-500/10",
    location: "bg-violet-500/10",
    time: "bg-amber-500/10",
  }
};

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/zamaxshar_tm", icon: "📸", bg: "linear-gradient(135deg, #feda75 0%, #d62976 50%, #4f5bd5 100%)", hint: "Daily postlar" },
  { label: "Telegram", href: "https://t.me/Zamaxshar_TM", icon: "✈️", bg: "linear-gradient(135deg, #37bbfe, #007dbb)", hint: "Yangiliklar" },
  { label: "YouTube", href: "https://youtube.com/@zamaxshar", icon: "▶️", bg: "linear-gradient(135deg, #ff4444, #cc0000)", hint: "Video darslar" },
];

function ContactCard({ item, i }) {
  const accentKey = item.key;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={i}
      variants={fadeUp}
      className="group"
    >
      {item.href ? (
        <a
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="relative h-full overflow-hidden rounded-[30px] border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
        >
          <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${CARD_LAYOUT.ring[accentKey]} blur-2xl`} />
          <div className="relative flex items-start gap-4">
            <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${item.color} shadow-lg shadow-black/10 grid place-items-center text-2xl shrink-0 ring-8 ring-white/70 dark:ring-slate-900/70`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[11px] font-bold tracking-[0.22em] text-slate-500 dark:text-slate-400 uppercase">{item.label}</p>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                  Ochish
                </span>
              </div>
              <p className="text-base font-extrabold leading-snug text-slate-900 dark:text-white break-words">
                {item.value}
              </p>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
            </div>
          </div>
        </a>
      ) : (
        <div className="relative h-full overflow-hidden rounded-[30px] border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${CARD_LAYOUT.ring[accentKey]} blur-2xl`} />
          <div className="relative flex items-start gap-4">
            <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${item.color} shadow-lg shadow-black/10 grid place-items-center text-2xl shrink-0 ring-8 ring-white/70 dark:ring-slate-900/70`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[11px] font-bold tracking-[0.22em] text-slate-500 dark:text-slate-400 uppercase">{item.label}</p>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-300">
                  Ma'lumot
                </span>
              </div>
              <p className="text-base font-extrabold leading-snug text-slate-900 dark:text-white break-words">
                {item.value}
              </p>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Contact() {
  const contacts = [
    {
      key: "phone",
      icon: "📞",
      label: "Telefon",
      value: "+998 90 893 00 02",
      href: "tel:+998908930002",
      color: "from-brand-400 to-brand-600",
    },
    {
      key: "telegram",
      icon: "✈️",
      label: "Telegram",
      value: "@zamaxshar_admin",
      href: "https://t.me/zamaxshar_admin",
      color: "from-sky-400 to-blue-600",
    },
    {
      key: "location",
      icon: "📍",
      label: "Manzil",
      value: "Qashqadaryo, Qamashi tumani, Amir Temur ko'chasi",
      href: null,
      color: "from-violet-400 to-violet-600",
    },
    {
      key: "time",
      icon: "🕐",
      label: "Ish vaqti",
      value: "Du–Sha: 09:00 – 18:00",
      href: null,
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#08111f] dark:via-[#091122] dark:to-[#050914]" />
      <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-brand-400/10 dark:bg-brand-500/8 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-12%] right-[-8%] w-[420px] h-[420px] rounded-full bg-violet-400/10 dark:bg-violet-500/8 blur-[120px] pointer-events-none" />

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
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
          {contacts.map((c, i) => (
            <ContactCard key={c.label} item={c} i={i} />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{ background: s.bg }}
                className="group flex items-center gap-4 rounded-[26px] p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.14)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.2)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm grid place-items-center text-2xl shadow-inner shrink-0">
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-80 mb-1">{s.label}</p>
                  <p className="font-extrabold text-lg leading-tight">{s.hint}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
