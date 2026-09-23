import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export type AdminAnalyticsPeriod = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';

export function useAdminAnalytics() {
  const [period, setPeriod] = useState<AdminAnalyticsPeriod>('30d');
  const [analytics, setAnalytics] = useState<any>({
    summary: {
      totalUsers: 0,
      totalSellers: 0,
      totalBuyers: 0,
      totalListings: 0,
      activeListings: 0,
      totalEnquiries: 0,
      totalConversations: 0,
    },
    userGrowthData: [],
    listingsDistribution: [],
    engagementData: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<any>(`/admin/analytics?period=${period}`);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [period]);

  return {
    period,
    setPeriod,
    analytics,
    loading
  };
}
