import { Seo } from '@/components/shared/Seo';
import { useSellerAnalytics } from '@/hooks/useSellerAnalytics';
import { SellerAnalyticsPeriodSelector } from '@/components/seller/analytics/SellerAnalyticsPeriodSelector';
import { SellerPerformanceOverview } from '@/components/seller/analytics/SellerPerformanceOverview';
import { SellerTopListings } from '@/components/seller/analytics/SellerTopListings';
import { SellerEnquiryAnalyticsCard } from '@/components/seller/analytics/SellerEnquiryAnalytics';
import { SellerMessageAnalyticsCard } from '@/components/seller/analytics/SellerMessageAnalytics';
import { SellerAnalyticsEmptyState } from '@/components/seller/analytics/SellerAnalyticsEmptyState';

export default function SellerAnalytics() {
  const {
    period,
    setPeriod,
    data,
    isLoading,
    error,
  } = useSellerAnalytics();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        Loading analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-semibold mb-2">Error loading analytics</h2>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  const {
    summary,
    listingPerformance,
    enquiryAnalytics,
    messageAnalytics,
    topListings,
  } = data;

  if (summary.totalListings === 0 && period === 'all') {
    return (
      <>
        <Seo title="Analytics - Seller Portal | InfyBuys" />
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics & Performance</h1>
            <p className="text-muted-foreground mt-1">
              Track your listing views and enquiries.
            </p>
          </div>
          <SellerAnalyticsEmptyState />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Analytics - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics & Performance</h1>
            <p className="text-muted-foreground mt-1">
              Track your listing views and enquiries.
            </p>
          </div>
          <div className="flex items-center">
            <SellerAnalyticsPeriodSelector period={period} onPeriodChange={setPeriod} />
          </div>
        </div>

        {summary.totalListings === 0 && period !== 'all' ? (
          <div className="py-12 text-center border rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium">No data for this period</h3>
            <p className="text-muted-foreground text-sm mt-1">Try selecting a longer time range.</p>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="sr-only">Performance Overview</h2>
              <SellerPerformanceOverview summary={summary} />
            </section>

            {/* Middle Section: Top Listings & Funnel */}
            <section className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <SellerTopListings listings={topListings} />
              </div>
              <div className="lg:col-span-1">
                <SellerEnquiryAnalyticsCard analytics={enquiryAnalytics} />
              </div>
              <div className="lg:col-span-1">
                <SellerMessageAnalyticsCard analytics={messageAnalytics} />
              </div>
            </section>

          </>
        )}
      </div>
    </>
  );
}
