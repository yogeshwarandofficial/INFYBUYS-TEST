import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { toast } from 'react-hot-toast';

export interface SellerProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  location: string;
  bio: string;
  sellerType: string;
  website: string;
  linkedin: string;
  yearsOfExperience: string;
  preferredCategories: string[];
  preferredLocations: string[];
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useSellerProfile() {
  return useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/users/me/seller-profile');
      return (res.data || res) as SellerProfileData;
    },
  });
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SellerProfileData>) => {
      const res = await apiClient.patch<any>('/users/me/seller-profile', data);
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useUploadSellerAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await apiClient.upload<any>('/users/me/seller-profile/avatar', formData);
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success('Avatar uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });
}
