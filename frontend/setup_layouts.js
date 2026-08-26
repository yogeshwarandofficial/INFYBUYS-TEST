const fs = require('fs');
const path = require('path');

const layouts = {
  'PublicLayout.tsx': import { Outlet } from 'react-router';\n\nexport function PublicLayout() {\n  return (\n    <div className="flex flex-col min-h-screen">\n      <header className="h-16 border-b flex items-center px-4">Public Header</header>\n      <main className="flex-1">\n        <Outlet />\n      </main>\n      <footer className="h-16 border-t flex items-center justify-center">Public Footer</footer>\n    </div>\n  );\n},
  'AuthLayout.tsx': import { Outlet } from 'react-router';\n\nexport function AuthLayout() {\n  return (\n    <div className="min-h-screen flex items-center justify-center bg-muted/40">\n      <div className="w-full max-w-md">\n        <Outlet />\n      </div>\n    </div>\n  );\n},
  'DashboardLayout.tsx': import { Outlet } from 'react-router';\n\nexport function DashboardLayout({ role }: { role: string }) {\n  return (\n    <div className="flex min-h-screen">\n      <aside className="w-64 border-r bg-muted/20 hidden md:block">\n        <div className="h-16 border-b flex items-center px-4 font-semibold capitalize">{role} Panel</div>\n        <nav className="p-4">Sidebar Nav</nav>\n      </aside>\n      <div className="flex-1 flex flex-col">\n        <header className="h-16 border-b flex items-center px-4">Top Header</header>\n        <main className="flex-1 p-6">\n          <Outlet />\n        </main>\n      </div>\n    </div>\n  );\n}
};

Object.entries(layouts).forEach(([file, content]) => {
  fs.writeFileSync(path.join('src', 'layouts', file), content);
});

const routesContent = import { createBrowserRouter } from 'react-router';\nimport { RootLayout } from '../layouts/RootLayout';\nimport { PublicLayout } from '../layouts/PublicLayout';\nimport { AuthLayout } from '../layouts/AuthLayout';\nimport { DashboardLayout } from '../layouts/DashboardLayout';\n\nexport const router = createBrowserRouter([\n  {\n    path: '/',\n    element: <RootLayout />,\n    children: [\n      {\n        element: <PublicLayout />,\n        children: [\n          { index: true, element: <div>Home Page Stub</div> }\n        ]\n      },\n      {\n        element: <AuthLayout />,\n        children: [\n          { path: 'login', element: <div>Login Stub</div> },\n          { path: 'register', element: <div>Register Stub</div> }\n        ]\n      },\n      {\n        path: 'buyer',\n        element: <DashboardLayout role="buyer" />,\n        children: [\n          { index: true, element: <div>Buyer Dashboard Stub</div> }\n        ]\n      },\n      {\n        path: 'seller',\n        element: <DashboardLayout role="seller" />,\n        children: [\n          { index: true, element: <div>Seller Dashboard Stub</div> }\n        ]\n      },\n      {\n        path: 'agency',\n        element: <DashboardLayout role="agency" />,\n        children: [\n          { index: true, element: <div>Agency Dashboard Stub</div> }\n        ]\n      },\n      {\n        path: 'admin',\n        element: <DashboardLayout role="admin" />,\n        children: [\n          { index: true, element: <div>Admin Dashboard Stub</div> }\n        ]\n      },\n      {\n        path: 'super-admin',\n        element: <DashboardLayout role="super-admin" />,\n        children: [\n          { index: true, element: <div>Super Admin Dashboard Stub</div> }\n        ]\n      }\n    ]\n  }\n]);\n;

fs.writeFileSync(path.join('src', 'routes', 'index.tsx'), routesContent);

const appContent = import { RouterProvider } from 'react-router';\nimport { router } from './routes';\nimport './index.css';\n\nfunction App() {\n  return <RouterProvider router={router} />;\n}\n\nexport default App;\n;

fs.writeFileSync(path.join('src', 'App.tsx'), appContent);
