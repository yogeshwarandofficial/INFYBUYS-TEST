import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import type { User } from '@/services/auth.service';

export interface UserSettings {
  emailNotifications: boolean;
  savedSearchAlerts: boolean;
  enquiryNotifications: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  themePreference: 'light' | 'dark' | 'system';
  languagePreference: string;
}

export const defaultSettings: UserSettings = {
  emailNotifications: true,
  savedSearchAlerts: true,
  enquiryNotifications: true,
  messageNotifications: true,
  marketingEmails: false,
  pushNotifications: false,
  themePreference: 'system',
  languagePreference: 'en',
};

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['user', 'settings'],
    queryFn: async (): Promise<UserSettings> => {
      const response = await apiClient.get<User>('/users/me');
      const settings = response.settings || {};
      return { ...defaultSettings, ...settings };
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      const response = await apiClient.patch('/users/me/settings', settings);
      return response; // backend returns the updated user
    },
    onSuccess: (updatedUser: any) => {
      const newSettings = { ...defaultSettings, ...(updatedUser.settings || {}) };
      queryClient.setQueryData(['user', 'settings'], newSettings);
      
      // Also update the cached user profile if it exists
      queryClient.setQueryData(['user', 'profile'], (old: any) => {
        if (!old) return old;
        return { ...old, settings: newSettings };
      });
    },
  });
};
