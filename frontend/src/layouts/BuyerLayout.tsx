import { Outlet } from 'react-router';
import { useState } from 'react';
import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { Seo } from '@/components/shared/Seo';

export function BuyerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sidebar-bg)]">
      <Seo title="Buyer Dashboard" noIndex={true} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <BuyerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F5F7FC] rounded-tl-[2rem] overflow-hidden shadow-2xl">
        <BuyerHeader />
        <main className="buyer-portal flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
