import { type SellerEnquiryAnalytics } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SellerEnquiryAnalyticsProps {
  analytics: SellerEnquiryAnalytics;
}

export function SellerEnquiryAnalyticsCard({ analytics }: SellerEnquiryAnalyticsProps) {
  const getPercentage = (value: number) => {
    if (analytics.total === 0) return 0;
    return (value / analytics.total) * 100;
  };

  const metrics = [
    { label: 'New', value: analytics.new, colorClass: 'bg-blue-500' },
    { label: 'Contacted', value: analytics.contacted, colorClass: 'bg-amber-500' },
    { label: 'Qualified', value: analytics.qualified, colorClass: 'bg-purple-500' },
    { label: 'Negotiating', value: analytics.negotiating, colorClass: 'bg-indigo-500' },
    { label: 'Closed (Won)', value: analytics.closed, colorClass: 'bg-emerald-500' },
    { label: 'Rejected', value: analytics.rejected, colorClass: 'bg-rose-500' },
  ];

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <CardHeader className="pb-4 shrink-0">
        <CardTitle className="text-lg text-[#111827]">Enquiry Funnel</CardTitle>
        <CardDescription className="text-[#64748B]">Breakdown of {analytics.total} enquiries in this period.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-5">
        {analytics.total === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
            <div className="bg-[#F5F3FF] text-[#7C3AED] rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
            <p className="text-[15px] font-medium text-[#111827]">No enquiries in this period.</p>
            <p className="text-[13px] text-[#64748B] max-w-[200px] mt-1">Change your time range or check back later.</p>
          </div>
        ) : (
          metrics.map((metric) => (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#64748B]">{metric.label}</span>
                <span className="font-semibold">{metric.value} <span className="text-[#64748B] font-normal text-xs ml-1">({getPercentage(metric.value).toFixed(1)}%)</span></span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${metric.colorClass} transition-all duration-500 ease-in-out`}
                  style={{ width: `${getPercentage(metric.value)}%` }}
                  aria-label={`${metric.label} constitutes ${getPercentage(metric.value).toFixed(1)} percent`}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
