import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, ShoppingBag, Package, HelpCircle, BarChart3 } from 'lucide-react';

export function AdminQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { title: 'Manage Users', icon: Users, path: '/admin/users' },
    { title: 'Manage Sellers', icon: UserCheck, path: '/admin/sellers' },
    { title: 'Manage Buyers', icon: ShoppingBag, path: '/admin/buyers' },
    { title: 'Review Listings', icon: Package, path: '/admin/listings' },
    { title: 'View Enquiries', icon: HelpCircle, path: '/admin/enquiries' },
    { title: 'View Analytics', icon: BarChart3, path: '/admin/analytics' },
  ];

  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white/60 hover:bg-white border-[#E5E9F2] rounded-xl text-[#111827] shadow-sm transition-colors"
              onClick={() => navigate(action.path)}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center mb-1"><action.icon className="w-5 h-5 text-[#2563EB]" /></div>
              <span className="text-[13px] font-medium text-[#111827]">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
