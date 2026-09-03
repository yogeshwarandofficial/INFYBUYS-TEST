import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useBuyerStore } from '@/store/useBuyerStore';
import { Heart, Mail, FileText, Eye, MessageSquare, Clock } from 'lucide-react';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'saved': return <Heart className="h-4 w-4 text-primary" />;
    case 'enquiry': return <Mail className="h-4 w-4 text-info" />;
    case 'nda': return <FileText className="h-4 w-4 text-success" />;
    case 'viewed': return <Eye className="h-4 w-4 text-muted-foreground" />;
    case 'message': return <MessageSquare className="h-4 w-4 text-warning" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export function RecentActivity() {
  const { recentActivity } = useBuyerStore();

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-[#111827]">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-muted rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
