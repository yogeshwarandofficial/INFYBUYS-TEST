import { Navigate, Outlet } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

export function PublicRoute() {
  const { status, user } = useUserStore();

  if (status === 'authenticated' && user) {
    // Redirect authenticated users trying to access auth pages to their dashboard
    if (user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase()))) {
      return <Navigate to="/admin" replace />;
    } else if (user.roles?.some(r => r.toLowerCase() === 'seller')) {
      return <Navigate to="/seller" replace />;
    }
    return <Navigate to="/buyer" replace />;
  }

  return <Outlet />;
}
