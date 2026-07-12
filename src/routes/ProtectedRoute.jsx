import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ permission, role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h3>Loading your session...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ==============================
  // Get Role
  // ==============================

  const currentRole = (user.role || user.roles?.[0] || "")
    .toString()
    .toLowerCase();

  // ==============================
  // Get Permissions
  // ==============================

  const permissions = (user.permissions || []).map((item) =>
    item.toString().toLowerCase(),
  );

  // ==============================
  // Check Role
  // ==============================

  if (role) {
    if (currentRole !== role.toLowerCase()) {
      return <Navigate to="/403" replace />;
    }
  }

  // ==============================
  // Check Permission
  // ==============================

  if (permission) {
    if (!permissions.includes(permission.toLowerCase())) {
      return <Navigate to="/403" replace />;
    }
  }

  // ==============================
  // URL Area Protection
  // ==============================

  if (
    window.location.pathname.startsWith("/admin") &&
    currentRole !== "admin"
  ) {
    return <Navigate to="/403" replace />;
  }

  if (
    window.location.pathname.startsWith("/teacher") &&
    currentRole !== "teacher"
  ) {
    return <Navigate to="/403" replace />;
  }

  if (
    window.location.pathname.startsWith("/student") &&
    currentRole !== "student"
  ) {
    return <Navigate to="/403" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
