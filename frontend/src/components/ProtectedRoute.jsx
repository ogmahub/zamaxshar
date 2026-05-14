import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!user) {
    const target = role === "admin" ? "/admin/login" : role === "teacher" ? "/teacher/login" : "/student/login";
    return <Navigate to={target} replace />;
  }
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
