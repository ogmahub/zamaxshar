import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get("/auth/session");
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const loginAdmin = async (username, password) => {
    const { data } = await api.post("/auth/admin/login", { username, password });
    setUser(data.user);
    return data.user;
  };

  const loginStudent = async (username, password) => {
    const { data } = await api.post("/auth/student/login", { username, password });
    setUser(data.user);
    return data.user;
  };

  const loginTeacher = async (username, password) => {
    const { data } = await api.post("/auth/teacher/login", { username, password });
    setUser(data.user);
    return data.user;
  };

  const login = async (username, password) => {
    const endpoints = [
      { url: "/auth/admin/login", role: "admin" },
      { url: "/auth/student/login", role: "student" },
      { url: "/auth/teacher/login", role: "teacher" },
    ];
    for (const ep of endpoints) {
      try {
        const { data } = await api.post(ep.url, { username, password });
        setUser(data.user);
        return { success: true, role: ep.role, user: data.user };
      } catch {}
    }
    return { success: false, message: "Login yoki parol noto'g'ri" };
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAdmin, loginStudent, loginTeacher, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
