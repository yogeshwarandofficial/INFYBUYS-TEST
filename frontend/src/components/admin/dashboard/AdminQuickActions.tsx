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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 bg-card hover:bg-muted/50 transition-colors"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
