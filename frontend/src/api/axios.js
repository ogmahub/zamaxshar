import axios from "axios";

const base = import.meta.env.VITE_API_URL || "https://zamaxshar.onrender.com";
const api = axios.create({
  baseURL: base.endsWith("/api") ? base : `${base}/api`,
  withCredentials: true
});

export default api;
