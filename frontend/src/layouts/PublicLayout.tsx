import { Outlet } from 'react-router';
import { PublicHeader } from '@/components/layout/public/PublicHeader';
import { PublicFooter } from '@/components/layout/public/PublicFooter';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1 pt-[73px]"> {/* Offset for fixed header */}
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
