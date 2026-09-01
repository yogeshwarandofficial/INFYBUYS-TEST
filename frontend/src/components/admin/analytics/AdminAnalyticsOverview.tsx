import { Users, Store, ShoppingBag, Package, HelpCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

interface AdminAnalyticsOverviewProps {
  summary: {
    totalUsers: number;
    totalSellers: number;
    totalBuyers: number;
    totalListings: number;
    activeListings: number;
    totalEnquiries: number;
    totalConversations: number;
  };
}

export function AdminAnalyticsOverview({ summary }: AdminAnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Total Users</span>
            <Users className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold">{summary.totalUsers}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-sm font-medium">Buyers</span>
            <ShoppingBag className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.totalBuyers}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <span className="text-sm font-medium">Sellers</span>
            <Store className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{summary.totalSellers}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400">
            <span className="text-sm font-medium">Listings</span>
            <Package className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{summary.totalListings}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-sm font-medium">Enquiries</span>
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.totalEnquiries}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <span className="text-sm font-medium">Messages</span>
            <MessageSquare className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold text-teal-700 dark:text-teal-300">{summary.totalConversations * 2}</span>
        </CardContent>
      </Card>
    </div>
  );
}
