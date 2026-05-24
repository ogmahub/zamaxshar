import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function PublicLayout() {
  const { serverSlow } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {serverSlow && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500 text-white text-sm font-semibold shadow-2xl max-w-[90vw]">
          <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Server uyg'onmoqda, biroz kuting...
        </div>
      )}
    </div>
  );
}
