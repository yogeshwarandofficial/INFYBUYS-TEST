import { Outlet, ScrollRestoration } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
