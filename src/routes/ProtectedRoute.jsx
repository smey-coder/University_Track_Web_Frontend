import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // 1. Grab 'loading' from your AuthContext
  const location = useLocation();

  // 2. CRITICAL: If the API is still checking the token, render a loading screen.
  // This halts all redirects until we know for sure if the user is logged in!
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h3>Loading your session...</h3>
      </div>
    );
  }

  // 3. Now that loading is false, if there is no user, redirect to login safely
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Prevent cross-access based on URL path prefix matching roles
  if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  if (location.pathname.startsWith('/teacher') && user.role !== 'teacher') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};