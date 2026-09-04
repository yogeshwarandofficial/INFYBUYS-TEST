import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../services/apiClient';

export interface NdaAgreement {
  id: string;
  listingId: string;
  buyerId: string;
  status: 'REQUESTED' | 'SIGNED';
  ndaVersion: string;
  requestedAt: string;
  signedAt: string | null;
  listing?: {
    id: string;
    title: string;
    seller?: {
      sellerProfile?: {
        businessName: string;
      };
    };
  };
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
}

export function useNdaStatus(listingId: string) {
  return useQuery({
    queryKey: ['nda', 'status', listingId],
    queryFn: async () => {
      const response = await api.get<{ ndaRequired: boolean; agreement: NdaAgreement | null }>(`/listings/${listingId}/nda/status`);
      return response;
    },
    enabled: !!listingId,
  });
}

export function useRequestNda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await api.post<NdaAgreement>(`/listings/${listingId}/nda/request`, {});
      return response;
    },
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['nda', 'status', listingId] });
      queryClient.invalidateQueries({ queryKey: ['nda', 'me'] });
    },
  });
}

export function useSignNda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await api.post<NdaAgreement>(`/listings/${listingId}/nda/sign`, {});
      return response;
    },
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['nda', 'status', listingId] });
      queryClient.invalidateQueries({ queryKey: ['nda', 'me'] });
    },
  });
}

export function useMyNdas() {
  return useQuery({
    queryKey: ['nda', 'me'],
    queryFn: async () => {
      const response = await api.get<NdaAgreement[]>('/nda/me');
      return response;
    },
  });
}

export function useSellerNdas() {
  return useQuery({
    queryKey: ['nda', 'seller'],
    queryFn: async () => {
      const response = await api.get<NdaAgreement[]>('/seller/nda');
      return response;
    },
  });
}
