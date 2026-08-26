import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import { subDays, subMonths, subYears, isAfter, format, startOfDay, eachDayOfInterval } from 'date-fns';

export type AdminAnalyticsPeriod = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';

export function useAdminAnalytics() {
  const [period, setPeriod] = useState<AdminAnalyticsPeriod>('30d');

  const { users, sellers, buyers, listings, enquiries, conversations } = useAdminStore();

  const getStartDate = (p: AdminAnalyticsPeriod): Date | null => {
    const now = new Date();
    switch (p) {
      case '7d': return subDays(now, 7);
      case '30d': return subDays(now, 30);
      case '90d': return subDays(now, 90);
      case '6m': return subMonths(now, 6);
      case '1y': return subYears(now, 1);
      case 'all': return null;
      default: return subDays(now, 30);
    }
  };

  const isWithinPeriod = (dateStr: string, startDate: Date | null) => {
    if (!startDate) return true;
    return isAfter(new Date(dateStr), startDate);
  };

  const analytics = useMemo(() => {
    const startDate = getStartDate(period);

    // Filter Data
    const filteredUsers = users.filter(u => isWithinPeriod(u.createdAt, startDate));
    const filteredListings = listings.filter(l => isWithinPeriod(l.createdAt, startDate));
    const filteredEnquiries = enquiries.filter(e => isWithinPeriod(e.createdAt, startDate));
    const filteredConversations = conversations.filter(c => isWithinPeriod(c.createdAt, startDate));

    // Summary KPIs
    const summary = {
      totalUsers: filteredUsers.length,
      totalSellers: filteredUsers.filter(u => u.role === 'seller').length,
      totalBuyers: filteredUsers.filter(u => u.role === 'buyer').length,
      totalListings: filteredListings.length,
      activeListings: filteredListings.filter(l => l.status === 'active').length,
      totalEnquiries: filteredEnquiries.length,
      totalConversations: filteredConversations.length,
    };

    // User Growth Time Series (daily for short periods, monthly/weekly for long could be done, but we'll stick to basic aggregation)
    const generateTimeSeries = (days: number) => {
      if (days > 365) days = 30; // Fallback for 'all' to just show last 30 days of shape
      const start = subDays(new Date(), days - 1);
      const interval = eachDayOfInterval({ start, end: new Date() });

      return interval.map(date => {
        const dateStr = format(date, 'MMM dd');
        const dayStart = startOfDay(date).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;

        const dayUsers = filteredUsers.filter(u => {
          const t = new Date(u.createdAt).getTime();
          return t >= dayStart && t < dayEnd;
        });

        return {
          date: dateStr,
          buyers: dayUsers.filter(u => u.role === 'buyer').length,
          sellers: dayUsers.filter(u => u.role === 'seller').length,
        };
      });
    };

    let daysToAggregate = 30;
    if (period === '7d') daysToAggregate = 7;
    else if (period === '30d') daysToAggregate = 30;
    else if (period === '90d') daysToAggregate = 90;
    else if (period === '6m') daysToAggregate = 180;
    else if (period === '1y') daysToAggregate = 365;

    const userGrowthData = generateTimeSeries(daysToAggregate);

    // Listings Distribution
    const listingsDistribution = [
      { name: 'Active', value: filteredListings.filter(l => l.status === 'active').length, color: 'var(--color-active)' },
      { name: 'Pending', value: filteredListings.filter(l => l.status === 'pending').length, color: 'var(--color-pending)' },
      { name: 'Sold', value: filteredListings.filter(l => l.status === 'sold').length, color: 'var(--color-sold)' },
      { name: 'Closed', value: filteredListings.filter(l => l.status === 'closed').length, color: 'var(--color-archived)' },
    ].filter(d => d.value > 0);

    // Engagement Data (Enquiries vs Messages)
    const engagementData = generateTimeSeries(daysToAggregate).map((day, idx) => {
      const start = subDays(new Date(), daysToAggregate - 1 - idx);
      const dayStart = startOfDay(start).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dayEnquiries = filteredEnquiries.filter(e => {
        const t = new Date(e.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayConversations = filteredConversations.filter(c => {
        const t = new Date(c.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      return {
        date: day.date,
        enquiries: dayEnquiries,
        messages: dayConversations * 2, // Mocking that each conversation has some messages
      };
    });

    return {
      summary,
      userGrowthData,
      listingsDistribution,
      engagementData
    };
  }, [period, users, sellers, buyers, listings, enquiries, conversations]);

  return {
    period,
    setPeriod,
    analytics
  };
}
