import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://zamaxshar.onrender.com/api",
  withCredentials: false
});

export default api;
