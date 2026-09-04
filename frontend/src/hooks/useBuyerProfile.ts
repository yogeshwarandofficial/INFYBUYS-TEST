import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export interface BuyerProfile {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  bio: string;
  buyerType: string;
  website: string;
  linkedin: string;
  avatarUrl: string | null;
}

export function useBuyerProfile() {
  return useQuery<BuyerProfile>({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me/buyer-profile');
      return response as any;
    },
  });
}

export function useUpdateBuyerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BuyerProfile>) => {
      const response = await apiClient.patch('/users/me/buyer-profile', data);
      return response as any;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['buyerProfile'], updatedProfile);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.upload('/users/me/buyer-profile/avatar', formData);
      return response as any;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['buyerProfile'], updatedProfile);
    },
  });
}
