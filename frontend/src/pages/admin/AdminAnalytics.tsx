import { useState } from 'react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { PageHeader } from '../../components/shared/PageHeader';
import { AdminAnalyticsPeriodSelector } from '../../components/admin/analytics/AdminAnalyticsPeriodSelector';
import { AdminAnalyticsOverview } from '../../components/admin/analytics/AdminAnalyticsOverview';
import { AdminUserGrowthChart } from '../../components/admin/analytics/AdminUserGrowthChart';
import { AdminListingsDistributionChart } from '../../components/admin/analytics/AdminListingsDistributionChart';
import { AdminEngagementChart } from '../../components/admin/analytics/AdminEngagementChart';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';

export default function AdminAnalytics() {
  const { period, setPeriod, analytics } = useAdminAnalytics();
  const { summary, userGrowthData, listingsDistribution, engagementData } = analytics;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
    { id: 'engagement', label: 'Engagement' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Analytics & Reporting"
        description="Monitor platform growth, listing performance, and user engagement."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap items-center p-1 bg-muted rounded-md space-x-1">
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

        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* KPI Cards */}
              <AdminAnalyticsOverview summary={summary} />

              {/* Main Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AdminUserGrowthChart data={userGrowthData} />
                <AdminListingsDistributionChart data={listingsDistribution} />
                <AdminEngagementChart data={engagementData} />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <AdminAnalyticsOverview summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AdminUserGrowthChart data={userGrowthData} />
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <AdminAnalyticsOverview summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminListingsDistributionChart data={listingsDistribution} />
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <AdminAnalyticsOverview summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AdminEngagementChart data={engagementData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
