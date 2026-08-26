import { Outlet } from 'react-router';

export function DashboardLayout({ role }: { role: string }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="h-16 border-b flex items-center px-4 font-semibold capitalize">{role} Panel</div>
        <nav className="p-4">Sidebar Nav</nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-4">Top Header</header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
