import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export type SellerAnalyticsPeriod = '7d' | '30d' | '90d' | 'year' | 'all';

export interface SellerAnalyticsSummary {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  totalConversations: number;
  unreadMessages: number;
  overallConversionRate: number;
}

export interface SellerListingPerformance {
  id: string;
  title: string;
  status: string;
  views: number;
  enquiries: number;
  conversionRate: number;
  performanceIndicator: 'excellent' | 'good' | 'average' | 'poor';
}

export interface SellerEnquiryAnalytics {
  total: number;
  pending: number;
  inDiscussion: number;
  nda: number;
  closed: number;
  rejected: number;
  conversionRate: number;
}

export interface SellerMessageAnalytics {
  totalConversations: number;
  activeConversations: number;
  archivedConversations: number;
  closedConversations: number;
  unreadMessages: number;
}

export interface SellerAnalyticsData {
  summary: SellerAnalyticsSummary;
  listingPerformance: SellerListingPerformance[];
  enquiryAnalytics: SellerEnquiryAnalytics;
  messageAnalytics: SellerMessageAnalytics;
  topListings: SellerListingPerformance[];
}

export function useSellerAnalytics() {
  const [period, setPeriod] = useState<SellerAnalyticsPeriod>('30d');

  const { data, isLoading, error } = useQuery<SellerAnalyticsData>({
    queryKey: ['seller-analytics', period],
    queryFn: async () => {
      const response = await apiClient.get<SellerAnalyticsData>(`/seller/analytics?period=${period}`);
      return ((response as any).data || response) as SellerAnalyticsData;
    },
  });

  return {
    period,
    setPeriod,
    data,
    isLoading,
    error,
  };
}
