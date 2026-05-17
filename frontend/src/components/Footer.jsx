import { Link } from "react-router-dom";

export default function Footer() {
  const socials = [
    {
      label: "Instagram",
      href: "https://instagram.com/zamaxshar_tm",
      bg: "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "Telegram",
      href: "https://t.me/Zamaxshar_TM",
      bg: "linear-gradient(135deg, #37bbfe, #007dbb)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@zamaxshar",
      bg: "linear-gradient(135deg, #ff4444, #cc0000)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  const navLinks = [
    { to: "/", label: "Bosh sahifa" },
    { to: "/courses", label: "Kurslar" },
    { to: "/teachers", label: "Ustozlar" },
    { to: "/register", label: "Ro'yxatdan o'tish" },
    { to: "/contact", label: "Aloqa" },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950 dark:bg-[#040810]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Brand col */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-11 h-11 rounded-2xl grid place-items-center shadow-lg shadow-black/30 overflow-hidden">
                <img src="/logo.svg" alt="ZAMAXSHAR" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-black text-lg text-white tracking-tight">ZAMAXSHAR</div>
                <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">O'quv Markazi</div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Zamonaviy ta'lim, tajribali ustozlar va sertifikat bilan sifatli bilim olish platformasi.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{ background: s.bg }}
                  className="w-10 h-10 rounded-2xl grid place-items-center text-white shadow-md hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav col */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Sahifalar</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-brand-400 text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="md:col-span-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Aloqa</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📍</span>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Qashqadaryo viloyati, Qamashi tumani, Amir Temur ko'chasi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <a href="tel:+998908930002" className="text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors">
                  +998 90 893 00 02
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✈️</span>
                <a href="https://t.me/zamaxshar_admin" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors">
                  @zamaxshar_admin
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} ZAMAXSHAR O'quv markazi. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Faol · Online
          </div>
        </div>
      </div>
    </footer>
  );
}
