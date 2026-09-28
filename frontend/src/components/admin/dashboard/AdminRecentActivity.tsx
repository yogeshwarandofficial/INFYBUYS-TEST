import { useAdminStore } from '@/store/useAdminStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCheck, ShoppingBag, Package, CheckCircle2, MessageSquare, Settings, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const getActivityIconInfo = (type: string) => {
  switch (type) {
    case 'seller_registered': return { Icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' };
    case 'user_registered': return { Icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' };
    case 'listing_submitted': return { Icon: Package, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' };
    case 'listing_approved': return { Icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' };
    case 'enquiry_received': return { Icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' };
    case 'account_updated': return { Icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
    default: return { Icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' };
  }
};

export function AdminRecentActivity() {
  const { recentActivity, markActivityRead } = useAdminStore();

  const handleRead = (id: string, read: boolean) => {
    if (!read) markActivityRead(id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle h-full">
      <h3 className="text-base font-semibold text-slate-900 mb-1">Recent Activity</h3>
      <p className="text-xs text-slate-500 mb-6">Latest events across the InfyBuys platform.</p>

      <ScrollArea className="h-[320px] w-full pr-4">
        <div className="space-y-0 relative">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No recent activity.</p>
          ) : (
            recentActivity.map((activity) => {
              const { Icon, color, bg } = getActivityIconInfo(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex gap-4 relative timeline-item group pb-6 cursor-pointer"
                  onClick={() => handleRead(activity.id, activity.read)}
                >
                  <div className="timeline-line"></div>
                  <div className={cn("relative z-10 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5", bg)}>
                    <Icon className={cn("w-3 h-3", color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={cn(
                        "text-sm font-medium leading-snug pr-4 transition-colors",
                        !activity.read ? "text-slate-900 font-semibold" : "text-slate-600 group-hover:text-slate-900"
                      )}>
                        {activity.description}
                      </p>
                      {!activity.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" title="Unread"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
