import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';

export interface KycDocument {
  id: string;
  documentType: 'IDENTITY' | 'BUSINESS_PROOF' | 'ADDRESS_PROOF' | 'OTHER';
  originalFileName: string;
  uploadedAt: string;
  url?: string;
}

export interface SellerKycData {
  status: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  legalName?: string;
  businessName?: string;
  businessAddress?: string;
  phone?: string;
  companyNumber?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  documents: KycDocument[];
}

export function useSellerKyc() {
  const [data, setData] = useState<SellerKycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKyc = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/seller/kyc');
      setData(res.data || res);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // If not found, it means KYC hasn't been started
        setData({ status: 'NOT_STARTED', documents: [] });
      } else {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  const submitKyc = async (payload: Partial<SellerKycData>) => {
    const res: any = await apiClient.post('/seller/kyc', payload);
    await fetchKyc();
    return res.data || res;
  };

  const uploadDocument = async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const res: any = await apiClient.upload('/seller/kyc/documents', formData);
    await fetchKyc();
    return res.data || res;
  };

  const deleteDocument = async (id: string) => {
    const res: any = await apiClient.delete(`/seller/kyc/documents/${id}`);
    await fetchKyc();
    return res.data || res;
  };

  const lookupCompany = async (companyNumber: string) => {
    const res: any = await apiClient.get(`/seller/kyc/company-lookup/${companyNumber}`);
    return res.data || res;
  };

  return {
    data,
    isLoading,
    error,
    submitKyc,
    uploadDocument,
    deleteDocument,
    lookupCompany,
    refetch: fetchKyc
  };
}
