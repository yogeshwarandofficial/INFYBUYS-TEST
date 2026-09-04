import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { useUserStore } from '@/store/useUserStore';
import { SellerStatCard } from '@/components/seller/dashboard/SellerStatCard';
import { SellerRecentActivity } from '@/components/seller/dashboard/SellerRecentActivity';
import { SellerQuickActions } from '@/components/seller/dashboard/SellerQuickActions';
import { Building2, Activity, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function SellerDashboard() {
  const { user } = useUserStore();
  const { stats, listings, enquiries, conversations } = useSellerStore();

  // Compute live stats from actual listings
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === 'active').length;
  const pendingListings = listings.filter((l) => l.status === 'pending').length;
  const soldListings = listings.filter((l) => l.status === 'sold').length;

  // Live enquiry KPIs derived from enquiries array
  const totalEnquiries = enquiries.length;

  // Live messaging KPIs derived from conversations array
  const unreadConversations = conversations.filter((c) => c.unreadCount > 0).length;

  return (
    <>
      <Seo title="Seller Dashboard" description="Manage your business listings, enquiries, and communications." />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
              Welcome back, {user?.name || 'Seller'}
            </h1>
            <p className="text-[15px] text-[#64748B]">
              Here's what's happening with your listings today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-5 py-3.5 rounded-xl border border-[#E5E9F2] shadow-sm">
              <div className="space-y-1.5 w-40 sm:w-48">
                <div className="flex justify-between text-[13px] font-semibold text-[#111827]">
                  <span>Profile setup</span>
                  <span className="text-[#2563EB]">{stats.profileCompletion}%</span>
                </div>
                <Progress value={stats.profileCompletion} className="h-1.5 bg-slate-100 [&>div]:bg-[#2563EB]" />
              </div>
            </div>
            <Button asChild className="hidden sm:flex bg-white/80 border border-[#E5E9F2] text-[#111827] rounded-xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all h-12 px-5 font-medium" variant="outline">
              <Link to="/seller/analytics">
                <BarChart3 className="w-4 h-4 mr-2 text-[#2563EB]" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SellerStatCard
            title="Total Listings"
            value={totalListings}
            icon={Building2}
            description="Overall listings created"
          />
          <SellerStatCard
            title="Active Listings"
            value={activeListings}
            icon={Activity}
            description="Currently visible to buyers"
          />
          <SellerStatCard
            title="Pending Approval"
            value={pendingListings}
            icon={Clock}
            description="Awaiting admin review"
          />
          <SellerStatCard
            title="Sold Businesses"
            value={soldListings}
            icon={DollarSign}
            description="Successfully closed"
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-full">
          <SellerRecentActivity />
          <SellerQuickActions />
        </div>
      </div>
    </>
  );
}
