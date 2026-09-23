import { useUserStore } from '@/store/useUserStore';
import { useBuyerStore } from '@/store/useBuyerStore';
import { BuyerStatCard } from '@/components/buyer/BuyerStatCard';
import { RecommendedListings } from '@/components/buyer/RecommendedListings';
import { Heart, Bookmark, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BuyerDashboard() {
  const { user } = useUserStore();
  const { savedCount, savedSearchesCount, enquiryCount, unreadMessageCount } = useBuyerStore();

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-[#64748B] mt-2 flex items-center gap-2 text-base">
            Here's what's happening with your account today.
            {user?.verified && <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Verified Buyer</Badge>}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/80 backdrop-blur-md border border-gray-200 text-[#111827] shadow-sm hover:bg-gray-50 rounded-lg h-10 px-5">Complete Profile</Button>
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-lg h-10 px-5">Browse Businesses</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <BuyerStatCard
          title="Saved Listings"
          value={savedCount}
          icon={Heart}
          trend={{ value: 12, isPositive: true }}
          description="from last month"
          iconBgClass="bg-[#EFF6FF] text-[#2563EB]"
        />
        <BuyerStatCard
          title="Saved Searches"
          value={savedSearchesCount}
          icon={Bookmark}
          iconBgClass="bg-[#DCFCE7] text-[#166534]"
        />
        <BuyerStatCard
          title="Active Enquiries"
          value={enquiryCount}
          icon={Mail}
          trend={{ value: 2, isPositive: true }}
          description="new this week"
          iconBgClass="bg-[#F5F3FF] text-[#7C3AED]"
        />
        <BuyerStatCard
          title="Unread Messages"
          value={unreadMessageCount}
          icon={MessageSquare}
          className={unreadMessageCount > 0 ? 'border-primary' : ''}
          iconBgClass="bg-[#FFEDD5] text-[#C2410C]"
        />
      </div>

      <div className="space-y-6">
        <RecommendedListings />
      </div>
    </div>
  );
}
