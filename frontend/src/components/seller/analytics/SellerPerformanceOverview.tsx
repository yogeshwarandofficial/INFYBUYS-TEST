import { SellerAnalyticsStatCard } from './SellerAnalyticsStatCard';
import { type SellerAnalyticsSummary } from '@/store/useSellerStore';
import { Building2, Eye, Mail, MessageSquare, Percent } from 'lucide-react';

interface SellerPerformanceOverviewProps {
  summary: SellerAnalyticsSummary;
}

export function SellerPerformanceOverview({ summary }: SellerPerformanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <SellerAnalyticsStatCard
        title="Active Listings"
        value={summary.activeListings}
        description={`Out of ${summary.totalListings} total`}
        icon={Building2}
      />
      <SellerAnalyticsStatCard
        title="Total Views"
        value={summary.totalViews.toLocaleString()}
        description="Across all active listings"
        icon={Eye}
      />
      <SellerAnalyticsStatCard
        title="Enquiries"
        value={summary.totalEnquiries.toLocaleString()}
        description={summary.unreadEnquiries > 0 ? `${summary.unreadEnquiries} unread` : 'All caught up'}
        icon={Mail}
      />
      <SellerAnalyticsStatCard
        title="Conversations"
        value={summary.totalConversations.toLocaleString()}
        description={summary.unreadMessages > 0 ? `${summary.unreadMessages} unread messages` : 'All caught up'}
        icon={MessageSquare}
      />
      <SellerAnalyticsStatCard
        title="Conversion Rate"
        value={`${summary.overallConversionRate.toFixed(1)}%`}
        description="Views to Enquiries"
        icon={Percent}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}
