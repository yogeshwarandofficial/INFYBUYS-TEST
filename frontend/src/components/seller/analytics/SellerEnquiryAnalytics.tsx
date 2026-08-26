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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <CardTitle className="text-lg">Enquiry Funnel</CardTitle>
        <CardDescription>Breakdown of {analytics.total} enquiries in this period.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-5">
        {analytics.total === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-8">
            No enquiries in this period.
          </div>
        ) : (
          metrics.map((metric) => (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">{metric.label}</span>
                <span className="font-semibold">{metric.value} <span className="text-muted-foreground font-normal text-xs ml-1">({getPercentage(metric.value).toFixed(1)}%)</span></span>
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
