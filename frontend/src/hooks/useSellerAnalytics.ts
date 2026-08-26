import { useMemo, useState } from 'react';
import {
  useSellerStore,
  type SellerAnalyticsPeriod,
  type SellerListingPerformance,
  type SellerAnalyticsSummary,
  type SellerEnquiryAnalytics,
  type SellerMessageAnalytics,
} from '@/store/useSellerStore';

const isWithinPeriod = (dateString: string, period: SellerAnalyticsPeriod): boolean => {
  if (period === 'all') return true;

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (period) {
    case '7d': return diffDays <= 7;
    case '30d': return diffDays <= 30;
    case '90d': return diffDays <= 90;
    default: return true;
  }
};

export function useSellerAnalytics() {
  const { listings, enquiries, conversations } = useSellerStore();
  const [period, setPeriod] = useState<SellerAnalyticsPeriod>('30d');

  const analytics = useMemo(() => {
    // 1. Filter by period
    const filteredListings = listings.filter((l) => isWithinPeriod(l.createdAt, period));
    const filteredEnquiries = enquiries.filter((e) => isWithinPeriod(e.createdAt, period));
    const filteredConversations = conversations.filter((c) => isWithinPeriod(c.createdAt, period));

    // 2. Listing Performance
    const listingPerformance: SellerListingPerformance[] = listings.map((listing) => {
      // Find enquiries and conversations for this listing within the period
      const listingEnquiries = filteredEnquiries.filter((e) => e.listingId === listing.id);

      // Calculate views (mocking period views proportionally if historical data isn't perfect)
      // Since it's frontend-only, we'll just use total views for 'all', or proportional for smaller periods
      // based on age, or just use the filtered enquiries count.
      // To be simple and robust: we'll use actual views if available, or just mock a ratio.
      // For Phase 5.6 we use the listing's current views as a base.
      let periodViews = listing.views;
      if (period !== 'all') {
         const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
         // Mocking that views are distributed evenly over the last 180 days
         periodViews = Math.round((listing.views / 180) * days);
         if (periodViews < listingEnquiries.length) periodViews = listingEnquiries.length * 5; // ensure sanity
      }

      const enquiriesCount = listingEnquiries.length;
      const conversionRate = periodViews > 0 ? (enquiriesCount / periodViews) * 100 : 0;

      let performanceIndicator: 'excellent' | 'good' | 'average' | 'poor' = 'poor';
      if (conversionRate > 5) performanceIndicator = 'excellent';
      else if (conversionRate > 2) performanceIndicator = 'good';
      else if (conversionRate > 0.5) performanceIndicator = 'average';

      return {
        id: listing.id,
        title: listing.title,
        status: listing.status,
        views: periodViews,
        enquiries: enquiriesCount,
        conversionRate,
        performanceIndicator,
      };
    }).sort((a, b) => b.views - a.views);

    // 3. Enquiry Analytics
    const enquiryAnalytics: SellerEnquiryAnalytics = {
      total: filteredEnquiries.length,
      new: filteredEnquiries.filter((e) => e.status === 'new').length,
      contacted: filteredEnquiries.filter((e) => e.status === 'contacted').length,
      qualified: filteredEnquiries.filter((e) => e.status === 'qualified').length,
      negotiating: filteredEnquiries.filter((e) => e.status === 'negotiating').length,
      closed: filteredEnquiries.filter((e) => e.status === 'closed').length,
      rejected: filteredEnquiries.filter((e) => e.status === 'rejected').length,
      conversionRate: 0,
    };

    const successfulEnquiries = enquiryAnalytics.closed;
    enquiryAnalytics.conversionRate = enquiryAnalytics.total > 0
      ? (successfulEnquiries / enquiryAnalytics.total) * 100
      : 0;

    // 4. Message Analytics
    const messageAnalytics: SellerMessageAnalytics = {
      totalConversations: filteredConversations.length,
      activeConversations: filteredConversations.filter((c) => c.status === 'active').length,
      archivedConversations: filteredConversations.filter((c) => c.status === 'archived').length,
      closedConversations: filteredConversations.filter((c) => c.status === 'closed').length,
      unreadMessages: filteredConversations.reduce((acc, c) => acc + c.unreadCount, 0),
    };

    // 5. Summary
    const totalViews = listingPerformance.reduce((acc, l) => acc + l.views, 0);
    const overallConversionRate = totalViews > 0 ? (enquiryAnalytics.total / totalViews) * 100 : 0;

    const summary: SellerAnalyticsSummary = {
      totalListings: filteredListings.length, // listings created in period
      activeListings: listings.filter(l => l.status === 'active').length, // overall active
      totalViews,
      totalEnquiries: enquiryAnalytics.total,
      unreadEnquiries: filteredEnquiries.filter(e => e.unreadCount > 0).length,
      totalConversations: messageAnalytics.totalConversations,
      unreadMessages: messageAnalytics.unreadMessages,
      overallConversionRate,
    };

    const topListings = [...listingPerformance]
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);

    return {
      summary,
      listingPerformance,
      enquiryAnalytics,
      messageAnalytics,
      topListings,
    };
  }, [listings, enquiries, conversations, period]);

  return {
    period,
    setPeriod,
    ...analytics,
  };
}
