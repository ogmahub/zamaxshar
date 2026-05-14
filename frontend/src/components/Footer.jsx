export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative rounded-3xl p-6 text-white overflow-hidden min-h-[300px] flex flex-col justify-between"
               style={{ background: "linear-gradient(135deg, #3b2c8f 0%, #1e1b4b 100%)" }}>
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -right-16 top-20 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white grid place-items-center mb-5">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6v10c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-2.76-2.24-5-5-5S4 2.24 4 5v11c0 3.87 3.13 7 7 7s7-3.13 7-7V7"
                        stroke="#3b2c8f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div className="text-2xl font-extrabold tracking-wider">ZAMAXSHAR</div>
              <div className="text-xs font-semibold tracking-[0.2em] text-white/70 mt-1">O'QUV MARKAZI</div>
            </div>

            <p className="relative text-sm text-white/80 leading-relaxed mt-6">
              Fan, ro'yxatdan o'tish va to'lov bo'yicha savollar uchun biz bilan bog'laning.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Turarjoy manzili</h3>
            <p className="text-brand-600 font-medium leading-relaxed">
              Qashqadaryo viloyati, Qamashi tumani, Amir Temur ko'chasi
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Aloqa</h3>
            <a href="tel:+998908930002" className="block text-brand-600 font-semibold hover:underline mb-4">
              +998 90 893 00 02
            </a>
            <a href="https://t.me/zamaxshar_admin" target="_blank" rel="noreferrer" className="text-brand-600 font-semibold hover:underline">
              @zamaxshar_admin
            </a>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Ijtimoiy tarmoqlar</h3>
            <div className="grid grid-cols-2 gap-3 max-w-[180px]">
              <a
                href="https://instagram.com/zamaxshar_tm"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="aspect-square rounded-2xl grid place-items-center text-white shadow-lg hover:scale-105 transition"
                style={{ background: "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://t.me/Zamaxshar_TM"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="aspect-square rounded-2xl grid place-items-center text-white shadow-lg hover:scale-105 transition"
                style={{ background: "linear-gradient(135deg, #37bbfe, #007dbb)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@zamaxshar"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="aspect-square rounded-2xl grid place-items-center text-white shadow-lg hover:scale-105 transition"
                style={{ background: "linear-gradient(135deg, #ff0000, #cc0000)" }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ZAMAXSHAR O'quv markazi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
