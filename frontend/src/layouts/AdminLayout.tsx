import { Outlet } from 'react-router';
import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Seo } from '@/components/shared/Seo';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Seo title="Admin Dashboard" noIndex={true} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-[#F8F9FA] dark:bg-transparent p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
