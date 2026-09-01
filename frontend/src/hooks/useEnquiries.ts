import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import type { Enquiry, EnquiryMessage } from '@/types/api';

export function useBuyerEnquiries() {
  return useQuery({
    queryKey: ['buyerEnquiries'],
    queryFn: async () => {
      const response = await apiClient.get<Enquiry[]>('/enquiries/me');
      return response;
    },
  });
}

export function useSellerEnquiries() {
  return useQuery({
    queryKey: ['sellerEnquiries'],
    queryFn: async () => {
      const response = await apiClient.get<Enquiry[]>('/seller/enquiries');
      return response;
    },
  });
}

export function useEnquiry(enquiryId: string) {
  return useQuery({
    queryKey: ['enquiry', enquiryId],
    queryFn: async () => {
      const response = await apiClient.get<Enquiry>(`/enquiries/${enquiryId}`);
      return response;
    },
    enabled: !!enquiryId,
  });
}

export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, messageText }: { listingId: string; messageText: string }) => {
      const response = await apiClient.post<Enquiry>(`/listings/${listingId}/enquiries`, {
        messageText,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerEnquiries'] });
    },
  });
}

export function useSendMessage(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageText }: { messageText: string }) => {
      const response = await apiClient.post<EnquiryMessage>(`/enquiries/${enquiryId}/messages`, {
        messageText,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiry', enquiryId] });
      queryClient.invalidateQueries({ queryKey: ['buyerEnquiries'] });
      queryClient.invalidateQueries({ queryKey: ['sellerEnquiries'] });
    },
  });
}

export function useMarkEnquiryRead(enquiryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.patch(`/enquiries/${enquiryId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiry', enquiryId] });
      queryClient.invalidateQueries({ queryKey: ['buyerEnquiries'] });
      queryClient.invalidateQueries({ queryKey: ['sellerEnquiries'] });
    },
  });
}
