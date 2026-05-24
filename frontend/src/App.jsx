import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import TeacherLayout from "./teacher/TeacherLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Home          = lazy(() => import("./pages/Home.jsx"));
const Courses       = lazy(() => import("./pages/Courses.jsx"));
const CourseDetail  = lazy(() => import("./pages/CourseDetail.jsx"));
const Teachers      = lazy(() => import("./pages/Teachers.jsx"));
const Register      = lazy(() => import("./pages/Register.jsx"));
const Contact       = lazy(() => import("./pages/Contact.jsx"));
const LoginPage     = lazy(() => import("./pages/LoginPage.jsx"));

const Dashboard     = lazy(() => import("./admin/Dashboard.jsx"));
const Applications  = lazy(() => import("./admin/Applications.jsx"));
const StudentsAdmin = lazy(() => import("./admin/StudentsAdmin.jsx"));
const CoursesAdmin  = lazy(() => import("./admin/CoursesAdmin.jsx"));
const TeachersAdmin = lazy(() => import("./admin/TeachersAdmin.jsx"));
const AdminsManage  = lazy(() => import("./admin/AdminsManage.jsx"));

const StudentDashboard = lazy(() => import("./student/StudentDashboard.jsx"));
const TeacherDashboard = lazy(() => import("./teacher/TeacherDashboard.jsx"));

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-slate-400 font-medium">Yuklanmoqda...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/students" element={<StudentsAdmin />} />
          <Route path="/admin/courses" element={<CoursesAdmin />} />
          <Route path="/admin/teachers" element={<TeachersAdmin />} />
          <Route path="/admin/admins" element={<AdminsManage />} />
        </Route>
      </Route>

      <Route path="/student/login" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      <Route path="/teacher/login" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
