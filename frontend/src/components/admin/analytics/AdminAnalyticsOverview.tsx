import { Users, Store, ShoppingBag, Package, HelpCircle, MessageSquare } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      
      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Total Users</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalUsers}</span>
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Buyers</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalBuyers}</span>
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-50/80 text-purple-600 border border-purple-100/50 flex items-center justify-center">
            <Store className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Sellers</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalSellers}</span>
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-cyan-50/80 text-cyan-600 border border-cyan-100/50 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Listings</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalListings}</span>
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-50/80 text-orange-600 border border-orange-100/50 flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Enquiries</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalEnquiries}</span>
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Conversations</span>
        <span className="text-3xl font-bold text-[#111827] mt-1">{summary.totalConversations}</span>
      </div>
      
    </div>
  );
}
