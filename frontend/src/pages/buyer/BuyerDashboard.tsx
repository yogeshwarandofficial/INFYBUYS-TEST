import { useUserStore } from '@/store/useUserStore';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BuyerStatCard } from '@/components/buyer/BuyerStatCard';
import { RecentActivity } from '@/components/buyer/RecentActivity';
import { RecommendedListings } from '@/components/buyer/RecommendedListings';
import { RecentlyViewed } from '@/components/buyer/RecentlyViewed';
import { QuickActions } from '@/components/buyer/QuickActions';
import { Heart, Bookmark, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BuyerDashboard() {
  const { user } = useUserStore();
  const { savedCount, savedSearchesCount, enquiryCount, unreadMessageCount } = useBuyerStore();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Here's what's happening with your account today.
            {user?.verified && <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Verified Buyer</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Complete Profile</Button>
          <Button>Browse Businesses</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BuyerStatCard
          title="Saved Listings"
          value={savedCount}
          icon={Heart}
          trend={{ value: 12, isPositive: true }}
          description="from last month"
        />
        <BuyerStatCard
          title="Saved Searches"
          value={savedSearchesCount}
          icon={Bookmark}
        />
        <BuyerStatCard
          title="Active Enquiries"
          value={enquiryCount}
          icon={Mail}
          trend={{ value: 2, isPositive: true }}
          description="new this week"
        />
        <BuyerStatCard
          title="Unread Messages"
          value={unreadMessageCount}
          icon={MessageSquare}
          className={unreadMessageCount > 0 ? 'border-primary' : ''}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecommendedListings />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}
