import { useNavigate } from 'react-router';
import { Users, UserCheck, ShoppingBag, Package, HelpCircle, BarChart3 } from 'lucide-react';

export function AdminQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { title: 'Manage Users', icon: Users, path: '/admin/users', colorClass: 'text-blue-500', hoverBorder: 'hover:border-blue-500' },
    { title: 'Manage Sellers', icon: UserCheck, path: '/admin/sellers', colorClass: 'text-teal-500', hoverBorder: 'hover:border-teal-500' },
    { title: 'Manage Buyers', icon: ShoppingBag, path: '/admin/buyers', colorClass: 'text-indigo-500', hoverBorder: 'hover:border-indigo-500' },
    { title: 'Review Listings', icon: Package, path: '/admin/listings', colorClass: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500' },
    { title: 'View Enquiries', icon: HelpCircle, path: '/admin/enquiries', colorClass: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
    { title: 'View Analytics', icon: BarChart3, path: '/admin/analytics', colorClass: 'text-purple-500', hoverBorder: 'hover:border-purple-500' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle">
      <h3 className="text-base font-semibold text-slate-900 mb-5">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center justify-center p-4 bg-white border border-slate-200 ${action.hoverBorder} rounded-lg shadow-sm hover:shadow transition-all group`}
          >
            <div className={`${action.colorClass} mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-slate-700">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
