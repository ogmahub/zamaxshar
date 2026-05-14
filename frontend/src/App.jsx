import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Teachers from "./pages/Teachers.jsx";
import Register from "./pages/Register.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Applications from "./admin/Applications.jsx";
import StudentsAdmin from "./admin/StudentsAdmin.jsx";
import CoursesAdmin from "./admin/CoursesAdmin.jsx";
import TeachersAdmin from "./admin/TeachersAdmin.jsx";
import AdminsManage from "./admin/AdminsManage.jsx";

import StudentLogin from "./student/StudentLogin.jsx";
import StudentDashboard from "./student/StudentDashboard.jsx";
import TeacherLogin from "./teacher/TeacherLogin.jsx";
import TeacherDashboard from "./teacher/TeacherDashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
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

      <Route path="/student/login" element={<StudentLogin />} />
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
