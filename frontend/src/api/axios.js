import axios from "axios";

const base = import.meta.env.VITE_API_URL || "https://zamaxshar.onrender.com";
const api = axios.create({
  baseURL: base.endsWith("/api") ? base : `${base}/api`,
  timeout: 30000
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("zamaxshar_token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`[API] No token in localStorage for ${config.method?.toUpperCase()} ${config.url}`);
    }
  } catch {
    // ignore storage access issues
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401) {
      console.error(`[API 401] Unauthorized on ${url} — token invalid or missing. Redirecting to /login.`);
      try { window.localStorage.removeItem("zamaxshar_token"); } catch {}
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    } else if (status === 403) {
      console.error(`[API 403] Forbidden on ${url} — insufficient permissions.`, error.response?.data);
    } else if (!error.response) {
      console.error(`[API Network Error] ${url}`, error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
