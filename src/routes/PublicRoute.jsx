import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Loading your session...</h3>
      </div>
    );
  }

  // Already authenticated

  if (user) {
    const role = (user.role || user.roles?.[0] || "").toString().toLowerCase();

    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;

      case "teacher":
        return <Navigate to="/teacher/dashboard" replace />;

      case "student":
        return <Navigate to="/student/dashboard" replace />;

      default:
        return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
