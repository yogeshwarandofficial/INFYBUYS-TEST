import { Navigate, Outlet, useLocation } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { status, user } = useUserStore();
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'session-expired') {
    return <Navigate to="/login" state={{ from: location, expired: true }} replace />;
  }

  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (status === 'verification-required') {
    return <Navigate to="/verify-email" replace />;
  }

  if (allowedRoles && !user.roles?.some(r => allowedRoles.includes(r.toLowerCase()))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
