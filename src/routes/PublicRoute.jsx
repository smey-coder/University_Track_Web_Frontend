import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = () => {
  const { user, loading } = useAuth(); // 1. Extract loading from context

  // 2. CRITICAL: Halt redirect logic if the backend API is still verifying the token
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h3>Loading your session...</h3>
      </div>
    );
  }

  // 3. If a user session exists, intercept them and redirect to their assigned dashboard
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  // 4. If no user session is active, allow access to public space (Login / Register pages)
  return <Outlet />;
};