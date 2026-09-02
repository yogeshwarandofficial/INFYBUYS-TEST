import { Seo } from '@/components/shared/Seo';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminStatCard } from '@/components/admin/dashboard/AdminStatCard';
import { AdminRecentActivity } from '@/components/admin/dashboard/AdminRecentActivity';
import { AdminQuickActions } from '@/components/admin/dashboard/AdminQuickActions';
import { Users, UserCheck, ShoppingBag, Package, DollarSign, AlertTriangle, X, MessageSquare, BarChart3, Store } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { useEffect } from 'react';

export default function AdminDashboard() {
  const { stats, systemAlerts, dismissSystemAlert, users, sellers, buyers, listings, enquiries, fetchPlatformData } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const totalUsers = users.length;

  const activeSellers = sellers.filter(s => s.status === 'active').length;
  const pendingSellers = sellers.filter(s => s.status === 'pending').length;
  const totalSellersCount = sellers.length;

  const totalBuyersCount = buyers.length;

  const activeListingsCount = listings.filter(l => l.status === 'active' || l.status === 'PUBLISHED').length;
  const totalListingsCount = listings.length;

  const totalEnquiriesCount = enquiries.length;

  return (
    <>
      <Seo title="Admin Dashboard | InfyBuys" />

      <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Dashboard Overview</h1>
            <p className="text-[15px] text-[#64748B] mt-1">
              Welcome back to the InfyBuys administrative portal.
            </p>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="space-y-3">
            {systemAlerts.map(alert => (
              <Alert key={alert.id} variant={alert.severity === 'error' ? 'destructive' : 'default'} className={alert.severity === 'warning' ? 'border-amber-500/50 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-600' : ''}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="capitalize font-semibold">{alert.severity} Alert</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Button variant="ghost" size="icon" onClick={() => dismissSystemAlert(alert.id)} className="h-6 w-6 -mr-2">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={Users}
            trend={{ value: 12, label: 'from last month', positive: true }}
          />
          <AdminStatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
            icon={DollarSign}
            trend={{ value: 8.4, label: 'from last month', positive: true }}
          />
          <AdminStatCard
            title="Active Sellers"
            value={activeSellers.toLocaleString()}
            icon={UserCheck}
            trend={{ value: 5, label: 'from last month', positive: true }}
          />
          <AdminStatCard
            title="Total Buyers"
            value={totalBuyersCount.toLocaleString()}
            icon={ShoppingBag}
            trend={{ value: 14, label: 'from last month', positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Sellers"
            value={totalSellersCount.toLocaleString()}
            icon={Store}
            description="Across all types"
          />
          <AdminStatCard
            title="Pending Approvals"
            value={pendingSellers.toLocaleString()}
            icon={AlertTriangle}
            description="Sellers requiring review"
            className={pendingSellers > 0 ? "border-amber-500/50" : ""}
          />
          <AdminStatCard
            title="Total Enquiries"
            value={totalEnquiriesCount.toLocaleString()}
            icon={MessageSquare}
            description="Buyer-Seller interactions"
          />
          <AdminStatCard
            title="Active Listings"
            value={activeListingsCount.toLocaleString()}
            icon={Package}
            trend={{ value: 2.1, label: 'from last week', positive: true }}
            description={`Out of ${totalListingsCount} total`}
          />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <AdminQuickActions />

            {/* Future Placeholder for Charts or Data Tables */}
            <div className="h-64 rounded-xl border border-dashed border-[#E5E9F2] bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
              <BarChart3 className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
              <h3 className="font-semibold text-lg text-[#111827]">Analytics Overview</h3>
              <p className="text-[14px] text-[#64748B] mt-1 max-w-sm">
                Detailed charts and platform metrics will be available in the upcoming Analytics module.
              </p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <AdminRecentActivity />
          </div>

        </div>

      </div>
    </>
  );
}
