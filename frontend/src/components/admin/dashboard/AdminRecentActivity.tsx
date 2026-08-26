import { useAdminStore } from '@/store/useAdminStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCheck, ShoppingBag, Package, CheckCircle2, MessageSquare, Settings, AlertCircle } from 'lucide-react';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'seller_registered': return <UserCheck className="w-4 h-4 text-emerald-500" />;
    case 'user_registered': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
    case 'listing_submitted': return <Package className="w-4 h-4 text-amber-500" />;
    case 'listing_approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'enquiry_received': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
    case 'account_updated': return <Settings className="w-4 h-4 text-slate-500" />;
    default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
  }
};

export function AdminRecentActivity() {
  const { recentActivity, markActivityRead } = useAdminStore();

  const handleRead = (id: string, read: boolean) => {
    if (!read) markActivityRead(id);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest events across the InfyBuys platform.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[300px] w-full px-6">
          <div className="space-y-4 pb-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    !activity.read ? 'bg-muted/50' : 'hover:bg-muted/30'
                  }`}
                  onClick={() => handleRead(activity.id, activity.read)}
                >
                  <div className="mt-0.5 bg-background border rounded-full p-1.5 shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${!activity.read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!activity.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
