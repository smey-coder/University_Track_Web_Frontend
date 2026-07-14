import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ==============================
// Authentication
// ==============================
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import SelectAccountType from "../pages/Auth/SelectAccountType";
import ActivateAccStudent from "../pages/Auth/ActivateAccStudent";
import ActivateAccTeacher from "../pages/Auth/ActivateAccTeacher";

// ==============================
// Layouts
// ==============================
import AppLayout from "../layouts/AppLayout"; // Swapped out specific layouts for your new universal AppLayout

// ==============================
// Pages (Adjust paths if Teacher/Student specific pages are created later)
// ==============================
import AdminDashboard from "../pages/Admin_pages/Dashboard";
import Student from "../pages/Admin_pages/students";
import Teacher from "../pages/Admin_pages/teachers";
import Department from "../pages/Admin_pages/departments";
import User from "../pages/Admin_pages/users/index";
import Permission from "../pages/Admin_pages/permissions";
import Role from "../pages/Admin_pages/roles";
import RolePermission from "../pages/Admin_pages/role_permissions";
import Course from "../pages/Admin_pages/courses";
import Assignment from "../pages/Admin_pages/assignments";

// ==============================
// Error Page
// ==============================
import Forbidden from "../pages/Errors/Forbidden";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ==========================
          Public Routes
      ========================== */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
        path="/activate"
        element={<SelectAccountType />}
        />
        <Route
        path="/activate/student"
        element={<ActivateAccStudent />}
        />
        <Route
        path="/activate/teacher"
        element={<ActivateAccTeacher />}
        />
      </Route>

      {/* ==========================
          ADMIN PORTAL
      ========================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AppLayout />
          </ProtectedRoute>
        }
        >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute permission="dashboard.view">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute permission="user.view">
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute permission="role.view">
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="permissions"
          element={
            <ProtectedRoute permission="permission.view">
              <Permission />
            </ProtectedRoute>
          }
        />
        <Route
          path="role_permission"
          element={
            <ProtectedRoute permission="role_permission.view">
              <RolePermission />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute permission="student.view">
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="teachers"
          element={
            <ProtectedRoute permission="teacher.view">
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="departments"
          element={
            <ProtectedRoute permission="department.view">
              <Department />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute permission="course.view">
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <ProtectedRoute permission="assignment.view">
              <Assignment />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ==========================
          TEACHER PORTAL
      ========================== */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <AppLayout /> 
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute permission="dashboard.view">
              <AdminDashboard /> {/* Shared dashboard component */}
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute permission="user.view">
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute permission="role.view">
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="permissions"
          element={
            <ProtectedRoute permission="permission.view">
              <Permission />
            </ProtectedRoute>
          }
        />
        <Route
          path="role_permission"
          element={
            <ProtectedRoute permission="role_permission.view">
              <RolePermission />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute permission="student.view">
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="teachers"
          element={
            <ProtectedRoute permission="teacher.view">
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="departments"
          element={
            <ProtectedRoute permission="department.view">
              <Department />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute permission="course.view">
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <ProtectedRoute permission="assignment.view">
              <Assignment />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ==========================
          STUDENT PORTAL
      ========================== */}
    <Route
      path="/student"
      element = {
        <ProtectedRoute role="student"> {/* Lowercase matching your API */}
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<ProtectedRoute permission="dashboard.view"><AdminDashboard /></ProtectedRoute>} />

      {/* Add this so students can load the students page! */}
      {/* <Route path="students" element={<ProtectedRoute permission="student.view"><Student /></ProtectedRoute>} />
      <Route path="teachers" element={<ProtectedRoute permission="teacher.view"><Teacher /></ProtectedRoute>} />
      <Route path="departments" element={<ProtectedRoute permission="department.view"><Department /></ProtectedRoute>} />
      <Route path="role_permission" element={<ProtectedRoute permission="role_permission.view"><RolePermission /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute permission="user.view"><User /></ProtectedRoute>} /> */}
      <Route
          path="users"
          element={
            <ProtectedRoute permission="user.view">
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute permission="role.view">
              <Role />
            </ProtectedRoute>
          }
        />
        <Route
          path="permissions"
          element={
            <ProtectedRoute permission="permission.view">
              <Permission />
            </ProtectedRoute>
          }
        />
        <Route
          path="role_permission"
          element={
            <ProtectedRoute permission="role_permission.view">
              <RolePermission />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute permission="student.view">
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="teachers"
          element={
            <ProtectedRoute permission="teacher.view">
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="departments"
          element={
            <ProtectedRoute permission="department.view">
              <Department />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute permission="course.view">
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <ProtectedRoute permission="assignment.view">
              <Assignment />
            </ProtectedRoute>
          }
        />
    </Route>

      {/* ==========================
          Error & Fallback Routes
      ========================== */}
      <Route path="/403" element={<Forbidden />} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};