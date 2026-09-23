import { Navigate, Outlet } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

export function PublicRoute() {
  const { status, user } = useUserStore();

  if (status === 'authenticated' && user) {
    // Redirect authenticated users trying to access auth pages
    if (user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
      return <Navigate to="/admin" replace />;
    }
    
    return <Navigate to="/" state={{ justLoggedIn: true }} replace />;
  }

  return <Outlet />;
}
