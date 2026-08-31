import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';

export function useAdminKyc() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/kyc');
      setApplications(res.data || res);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    refetch: fetchApplications
  };
}

export function useAdminKycDetails(sellerId: string) {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!sellerId) return;
    try {
      setIsLoading(true);
      const res: any = await apiClient.get(`/admin/kyc/${sellerId}`);
      setDetails(res.data || res);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const approveKyc = async () => {
    await apiClient.post(`/admin/kyc/${sellerId}/approve`, {});
    await fetchDetails();
  };

  const rejectKyc = async (reason: string) => {
    await apiClient.post(`/admin/kyc/${sellerId}/reject`, { reason });
    await fetchDetails();
  };

  return {
    details,
    isLoading,
    error,
    approveKyc,
    rejectKyc,
    refetch: fetchDetails
  };
}
