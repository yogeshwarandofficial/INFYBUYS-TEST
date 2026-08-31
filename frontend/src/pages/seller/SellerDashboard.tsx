import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { useSellerStore } from '@/store/useSellerStore';
import { useUserStore } from '@/store/useUserStore';
import { useSellerKyc } from '@/hooks/useSellerKyc';
import { SellerStatCard } from '@/components/seller/dashboard/SellerStatCard';
import { SellerRecentActivity } from '@/components/seller/dashboard/SellerRecentActivity';
import { SellerQuickActions } from '@/components/seller/dashboard/SellerQuickActions';
import { Building2, Activity, Clock, DollarSign, Mail, MessageSquare, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react';
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

  const { data: kycData } = useSellerKyc();

  return (
    <>
      <Seo title="Seller Dashboard" description="Manage your business listings, enquiries, and communications." />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title={`Welcome back, ${user?.name || 'Seller'}`}
            description="Here's what's happening with your listings today."
            breadcrumbs={[{ label: 'Dashboard' }]}
            className="mb-0"
          />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/seller/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <div className="flex items-center gap-4 bg-card px-4 py-3 rounded-lg border">
              <div className="space-y-1 w-32 sm:w-48">
                <div className="flex justify-between text-xs font-medium">
                  <span>Profile setup</span>
                  <span>{stats.profileCompletion}%</span>
                </div>
                <Progress value={stats.profileCompletion} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {kycData?.status === 'NOT_STARTED' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">KYC Verification Required</h3>
                <p className="text-red-700 text-sm">Complete your business verification before submitting listings.</p>
              </div>
            </div>
            <Button asChild variant="default" className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/seller/kyc">Start Verification</Link>
            </Button>
          </div>
        )}

        {kycData?.status === 'PENDING' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="text-yellow-800 font-medium">KYC Verification Pending</h3>
              <p className="text-yellow-700 text-sm">Our team is reviewing your business information.</p>
            </div>
          </div>
        )}

        {kycData?.status === 'REJECTED' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">KYC Verification Rejected</h3>
                <p className="text-red-700 text-sm">Reason: {kycData.rejectionReason}. Please update your info.</p>
              </div>
            </div>
            <Button asChild variant="default" className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/seller/kyc">Resubmit KYC</Link>
            </Button>
          </div>
        )}

        {kycData?.status === 'APPROVED' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="text-green-800 font-medium">KYC Verified</h3>
              <p className="text-green-700 text-sm">Your business has been verified.</p>
            </div>
          </div>
        )}

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
          <SellerStatCard
            title="Total Enquiries"
            value={totalEnquiries}
            icon={Mail}
            description="From potential buyers"
            className="sm:col-span-2"
          />
          <SellerStatCard
            title="Unread Messages"
            value={unreadConversations}
            icon={MessageSquare}
            description="Requires your attention"
            className="sm:col-span-2"
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
