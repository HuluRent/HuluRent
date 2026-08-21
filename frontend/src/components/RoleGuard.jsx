import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RoleGuard({ children, role }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== role) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">gpp_bad</span>
          <h1 className="text-2xl font-bold text-text mb-2">Access Denied</h1>
          <p className="text-text-muted">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
