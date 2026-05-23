import axios from "axios";

const base = import.meta.env.VITE_API_URL || "https://zamaxshar.onrender.com";
const api = axios.create({
  baseURL: base.endsWith("/api") ? base : `${base}/api`,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("zamaxshar_token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage access issues
  }
  return config;
});

export default api;
