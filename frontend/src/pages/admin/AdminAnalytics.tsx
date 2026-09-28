import { useState } from 'react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { AdminAnalyticsPeriodSelector } from '../../components/admin/analytics/AdminAnalyticsPeriodSelector';
import { AdminAnalyticsOverview } from '../../components/admin/analytics/AdminAnalyticsOverview';
import { AdminUserGrowthChart } from '../../components/admin/analytics/AdminUserGrowthChart';
import { AdminListingsDistributionChart } from '../../components/admin/analytics/AdminListingsDistributionChart';
import { AdminEngagementChart } from '../../components/admin/analytics/AdminEngagementChart';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';

export default function AdminAnalytics() {
  const { period, setPeriod, analytics, loading } = useAdminAnalytics();
  const { summary, userGrowthData, listingsDistribution, engagementData } = analytics;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
    { id: 'engagement', label: 'Engagement' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Platform Analytics</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Monitor key performance metrics and platform growth</p>
      </div>

      {/* Summary stat cards — always visible regardless of tab */}
      <AdminAnalyticsOverview summary={summary} />

      <div className="container mx-auto px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center p-1 bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl space-x-1">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-3 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground"
                    : "text-muted-foreground hover:bg-muted-foreground/10"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <AdminAnalyticsPeriodSelector period={period} onPeriodChange={setPeriod} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-[#64748B]">
            <svg className="animate-spin h-6 w-6 mr-3 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading analytics…
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <AdminUserGrowthChart 
                    data={userGrowthData} 
                    totalBuyers={summary.totalBuyers} 
                    totalSellers={summary.totalSellers} 
                  />
                  <AdminListingsDistributionChart 
                    data={listingsDistribution} 
                    totalListings={summary.totalListings} 
                  />
                  <AdminEngagementChart 
                    data={engagementData} 
                    totalEnquiries={summary.totalEnquiries}
                    totalConversations={summary.totalConversations}
                  />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <AdminUserGrowthChart 
                    data={userGrowthData} 
                    totalBuyers={summary.totalBuyers} 
                    totalSellers={summary.totalSellers} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AdminListingsDistributionChart 
                    data={listingsDistribution} 
                    totalListings={summary.totalListings} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <AdminEngagementChart 
                    data={engagementData} 
                    totalEnquiries={summary.totalEnquiries}
                    totalConversations={summary.totalConversations}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
