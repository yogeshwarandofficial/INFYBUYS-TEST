import { Outlet } from 'react-router';
import { useState } from 'react';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerHeader } from '@/components/seller/SellerHeader';
import { Seo } from '@/components/shared/Seo';

export function SellerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sidebar-bg)]">
      <Seo title="Seller Dashboard" noIndex={true} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <SellerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F6F8FC] rounded-tl-[2rem] overflow-hidden shadow-2xl">
        <SellerHeader />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
