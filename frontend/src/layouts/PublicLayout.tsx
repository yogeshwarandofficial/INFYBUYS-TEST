import { Outlet, useLocation } from 'react-router';
import { PublicHeader } from '@/components/layout/public/PublicHeader';
import { PublicFooter } from '@/components/layout/public/PublicFooter';

export function PublicLayout() {
  const location = useLocation();
  const isTransparentLayout = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/pricing' || location.pathname === '/contact' || location.pathname === '/search' || location.pathname === '/guides' || location.pathname === '/help' || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/advisory-booking' || location.pathname.startsWith('/blog');

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className={`flex-1 ${isTransparentLayout ? 'pt-0' : 'pt-[116px]'}`}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
