import { Seo } from '@/components/shared/Seo';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminStatCard } from '@/components/admin/dashboard/AdminStatCard';
import { AdminRecentActivity } from '@/components/admin/dashboard/AdminRecentActivity';
import { AdminQuickActions } from '@/components/admin/dashboard/AdminQuickActions';
import { Users, UserCheck, ShoppingBag, Package, DollarSign, AlertTriangle, X, MessageSquare, BarChart3, Store } from 'lucide-react';

import { useEffect } from 'react';

export default function AdminDashboard() {
  const { stats, systemAlerts, dismissSystemAlert, sellers, fetchPlatformData } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const totalUsers = stats.totalUsers;

  const activeSellers = sellers.filter(s => s.status === 'active').length || 0;
  const pendingSellers = stats.pendingApprovals;
  const totalSellersCount = stats.totalSellers;

  const totalBuyersCount = stats.totalBuyers;

  const activeListingsCount = stats.activeListings;

  const totalEnquiriesCount = stats.totalEnquiries;

  return (
    <>
      <Seo title="Admin Dashboard | InfyBuys" />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto space-y-8 pb-12">

          {/* Page Header */}
          <div className="animate-fade-in flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Welcome back to the InfyBuys administrative portal.</p>
            </div>
          </div>

          {/* System Alerts */}
          {systemAlerts.length > 0 && (
            <div className="space-y-3 animate-slide-up">
              {systemAlerts.map(alert => (
                <div key={alert.id} className={alert.severity === 'warning' ? "bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 shadow-sm" : "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 shadow-sm"}>
                  <AlertTriangle className={alert.severity === 'warning' ? "text-amber-500 w-5 h-5 shrink-0 mt-0.5" : "text-red-500 w-5 h-5 shrink-0 mt-0.5"} />
                  <div className="flex-1">
                    <h4 className={alert.severity === 'warning' ? "text-sm font-semibold text-amber-800 capitalize" : "text-sm font-semibold text-red-800 capitalize"}>{alert.severity} Alert</h4>
                    <p className={alert.severity === 'warning' ? "text-sm text-amber-700 mt-0.5" : "text-sm text-red-700 mt-0.5"}>{alert.message}</p>
                  </div>
                  <button onClick={() => dismissSystemAlert(alert.id)} className={alert.severity === 'warning' ? "text-amber-500 hover:text-amber-700 transition-colors p-1" : "text-red-500 hover:text-red-700 transition-colors p-1"}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Stats Grid (8 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up delay-100">
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
            />
          </div>

          {/* Bottom Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up delay-200">
            
            {/* Left Column (Actions & Analytics) */}
            <div className="lg:col-span-2 space-y-6">
              <AdminQuickActions />

              {/* Analytics Teaser */}
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Analytics Overview</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Detailed charts and platform metrics will be available in the upcoming Analytics module.
                </p>
              </div>
            </div>

            {/* Right Column (Recent Activity) */}
            <div className="lg:col-span-1">
              <AdminRecentActivity />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
