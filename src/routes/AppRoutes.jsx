import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

// Authentication Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Layout Wrappers
import AdminLayout from "../layouts/AdminLayout";
// import TeacherLayout from '../layouts/TeacherLayout';

// Render Content Pages
// Admin Page
import AdminDashboard from "../pages/Admin_pages/Dashboard";
import Student from "../pages/Admin_pages/students/index";
import Teacher from "../pages/Admin_pages/teachers/index";
// import TeacherDashboard from '../pages/Teacher_pages/Dashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Authentication Sub-Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 2. Guarded Secure System Workspace */}
      <Route element={<ProtectedRoute />}>
        {/* Admin Space */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<Student />} />
          <Route path="teachers" element={<Teacher />} />
        </Route>

        {/* Teacher Space */}
        {/* <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
        </Route> */}
      </Route>

      {/* Wildcard Route Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
