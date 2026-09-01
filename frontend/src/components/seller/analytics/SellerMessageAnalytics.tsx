import { type SellerMessageAnalytics } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerMessageAnalyticsProps {
  analytics: SellerMessageAnalytics;
}

export function SellerMessageAnalyticsCard({ analytics }: SellerMessageAnalyticsProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <CardTitle className="text-lg">Messaging Overview</CardTitle>
        <CardDescription>Status of your buyer communications.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
            <span className="text-sm font-medium">Total Conversations</span>
            <span className="font-semibold">{analytics.totalConversations}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
            <span className="text-sm font-medium">Active</span>
            <span className="font-semibold text-primary">{analytics.activeConversations}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
            <span className="text-sm font-medium">Unread Messages</span>
            <span className="font-semibold text-destructive">{analytics.unreadMessages}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">Archived / Closed</span>
            <span className="font-semibold text-muted-foreground">{analytics.archivedConversations + analytics.closedConversations}</span>
          </div>
        </div>

        <div className="pt-6 mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/seller/messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Go to Messages
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
