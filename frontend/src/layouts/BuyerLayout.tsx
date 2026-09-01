import { Outlet } from 'react-router';
import { useState } from 'react';
import { BuyerSidebar } from '@/components/buyer/BuyerSidebar';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { Seo } from '@/components/shared/Seo';

export function BuyerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Seo title="Buyer Dashboard" noIndex={true} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <BuyerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <BuyerHeader />
        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
