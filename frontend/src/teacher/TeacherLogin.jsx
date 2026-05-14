import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

export default function TeacherLogin() {
  const { loginTeacher } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginTeacher(username, password);
      toast.success("Welcome!");
      navigate("/teacher/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-br from-blue-50 to-indigo-200 dark:from-slate-900 dark:to-indigo-950">
      <form onSubmit={submit} className="card p-8 w-full max-w-md" autoComplete="off">
        <div className="text-center mb-6">
          <div className="inline-grid place-items-center w-14 h-14 rounded-2xl text-white text-2xl mb-3"
               style={{ background: "linear-gradient(135deg, #3b82f6, #4f46e5)" }}>👨‍🏫</div>
          <h1 className="text-2xl font-bold">O'qituvchi kirish</h1>
          <p className="text-sm text-slate-500 mt-1">Login va parolingiz bilan kiring</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label block mb-1">Login</label>
            <input
              className="input"
              required
              autoComplete="off"
              name="teacher-login-uniq"
              placeholder="login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label block mb-1">Parol</label>
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #4f46e5)" }}>
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </button>
          <Link to="/" className="block text-center text-sm text-slate-500 hover:text-indigo-600 transition pt-2">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </form>
    </div>
  );
}
