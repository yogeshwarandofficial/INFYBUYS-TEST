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
    <Card className="h-full flex flex-col bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Recent Activity</CardTitle>
        <CardDescription className="text-[#64748B]">Latest events across the InfyBuys platform.</CardDescription>
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
                    !activity.read ? 'bg-[#F8FAFC]' : 'hover:bg-white/60'
                  }`}
                  onClick={() => handleRead(activity.id, activity.read)}
                >
                  <div className="mt-0.5 bg-[#F6F8FC] border border-[#E5E9F2] rounded-xl p-2 shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-[14px] ${!activity.read ? 'font-semibold text-[#111827]' : 'font-medium text-[#64748B]'}`}>
                      {activity.description}
                    </p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!activity.read && (
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
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
