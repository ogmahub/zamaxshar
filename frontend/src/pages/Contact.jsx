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
  {
    label: "Instagram",
    href: "https://instagram.com/zamaxshar_tm",
    icon: "instagram",
    topBg: "linear-gradient(135deg, #ffcf71 0%, #ff5da2 45%, #7c4dff 100%)",
    cardBg: "linear-gradient(135deg, #f7c55f 0%, #f65bb6 48%, #7c5cff 100%)",
    hint: "Daily postlar",
  },
  {
    label: "Telegram",
    href: "https://t.me/Zamaxshar_TM",
    icon: "telegram",
    topBg: "linear-gradient(135deg, #4cc6ff 0%, #1796df 100%)",
    cardBg: "linear-gradient(135deg, #3fb9ff 0%, #128fd5 100%)",
    hint: "Yangiliklar",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@zamaxshar",
    icon: "youtube",
    topBg: "linear-gradient(135deg, #ff4f4f 0%, #e60000 100%)",
    cardBg: "linear-gradient(135deg, #ff4141 0%, #d90000 100%)",
    hint: "Video darslar",
  },
];

function SocialGlyph({ type }) {
  const common = "h-7 w-7 sm:h-8 sm:w-8 text-white";

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (type === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M21.5 4.7 18.6 19.8c-.2 1.1-1 1.4-2 .9l-5.5-4.1-2.7 2.6c-.3.3-.6.6-1.2.6l.4-5.7 10.4-9.4c.5-.4-.1-.7-.7-.3L6.1 13.3 1.6 11.9c-1-.3-1-1 .2-1.5L20 4.2c.9-.3 1.6.2 1.5 1z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
      <path
        d="M9.5 8.2v7.6l6.5-3.8-6.5-3.8z"
        fill="currentColor"
      />
      <path
        d="M21 12c0-1.3-.1-2.6-.3-3.7-.2-1.1-1-2-2.1-2.2C16.8 5.7 12 5.7 12 5.7s-4.8 0-6.6.4c-1.1.2-1.9 1.1-2.1 2.2C3.1 9.4 3 10.7 3 12s.1 2.6.3 3.7c.2 1.1 1 2 2.1 2.2 1.8.4 6.6.4 6.6.4s4.8 0 6.6-.4c1.1-.2 1.9-1.1 2.1-2.2.2-1.1.3-2.4.3-3.7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialTopIcon({ item }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      aria-label={item.label}
      className="group grid place-items-center h-16 w-16 sm:h-18 sm:w-18 rounded-full p-1 shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
      style={{ background: item.topBg }}
    >
      <div className="grid place-items-center h-full w-full rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
        <SocialGlyph type={item.icon} />
      </div>
    </a>
  );
}

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
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.34em] mb-6">
            Ijtimoiy tarmoqlar
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{ background: s.cardBg }}
                className="group relative flex items-center gap-4 rounded-[30px] p-5 sm:p-6 text-left shadow-[0_16px_40px_rgba(15,23,42,0.16)] hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.22)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-white/14 backdrop-blur-md grid place-items-center shadow-inner ring-1 ring-white/10 shrink-0">
                  <SocialGlyph type={s.icon} />
                </div>
                <div className="relative min-w-0 flex-1 text-white">
                  <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.3em] opacity-80 mb-1 sm:mb-2">
                    {s.label}
                  </p>
                  <p className="font-black text-xl sm:text-2xl leading-tight">
                    {s.hint}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
