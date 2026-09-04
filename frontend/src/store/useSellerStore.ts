import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/apiClient';
import { queryClient } from '@/App';

// â”€â”€â”€ Activity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface SellerActivity {
  id: string;
  type: 'enquiry' | 'message' | 'view' | 'system' | 'listing';
  title: string;
  description: string;
  date: string;
  read: boolean;
}

// â”€â”€â”€ Dashboard Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface SellerDashboardStats {
  totalEnquiries: number;
  unreadMessages: number;
  profileCompletion: number;
}

// â”€â”€â”€ Listings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SellerListingStatus = 'draft' | 'pending' | 'active' | 'sold' | 'archived';

export interface SellerListing {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  location: string;
  description: string;
  askingPrice: number;
  revenue?: number;
  profit?: number;
  establishedYear?: number;
  employees?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  ndaRequired?: boolean;
  status: SellerListingStatus;
  image?: string;
  images?: string[];
  media?: import('@/types/api').ListingMedia[];
  coverMediaId?: string;
  views: number;
  enquiries: number;
  createdAt: string;
  updatedAt: string;
}

// â”€â”€â”€ Enquiries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SellerEnquiryStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'negotiating'
  | 'closed'
  | 'rejected';

export type SellerEnquiryPriority = 'low' | 'medium' | 'high';

export interface EnquiryAttachment {
  id: string;
  name: string;
  size: number; // bytes (mock)
  type: string; // mime type (mock)
}

export interface EnquiryResponse {
  id: string;
  enquiryId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  message: string;
  createdAt: string;
  attachments: EnquiryAttachment[];
}

export interface SellerEnquiry {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerCompany?: string;
  listingTitle: string;
  subject: string;
  message: string;
  status: SellerEnquiryStatus;
  priority: SellerEnquiryPriority;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  unreadCount: number;
  responses: EnquiryResponse[];
}

// â”€â”€â”€ Messaging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SellerConversationStatus = 'active' | 'archived' | 'closed';
export type SellerMessageSender = 'buyer' | 'seller';

export interface SellerMessageAttachment {
  id: string;
  name: string;
  size: number; // bytes (mock)
  type: string; // MIME type (mock)
}

export interface SellerMessage {
  id: string;
  conversationId: string;
  senderType: SellerMessageSender;
  senderName: string;
  message: string;
  attachments: SellerMessageAttachment[];
  createdAt: string;
  isRead: boolean;
}

export interface SellerConversation {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerCompany?: string;
  enquiryId?: string; // link to related enquiry if originated from one
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: SellerConversationStatus;
  createdAt: string;
  updatedAt: string;
  messages: SellerMessage[];
}

// â”€â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SellerNotificationType = 'listing' | 'enquiry' | 'message' | 'subscription' | 'system' | 'approval' | 'payment' | 'nda' | 'NDA_REQUESTED' | 'NDA_SIGNED';
export type SellerNotificationPriority = 'low' | 'medium' | 'high';

export interface SellerNotification {
  id: string;
  type: SellerNotificationType;
  priority: SellerNotificationPriority;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  entityId?: string;
  entityType?: string;
}


// â”€â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SellerAnalyticsPeriod = '7d' | '30d' | '90d' | 'all';

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
  new: number;
  contacted: number;
  qualified: number;
  negotiating: number;
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

// â”€â”€â”€ Profile & Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface SellerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  location: string;
  bio: string;
  sellerType: 'broker' | 'individual' | 'agency';
  website: string;
  linkedin: string;
  yearsOfExperience: string;
  preferredCategories: string[];
  preferredLocations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerSettings {
  notifications: {
    emailNotifications: boolean;
    enquiryNotifications: boolean;
    messageNotifications: boolean;
    listingNotifications: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
  };
  preferences: {
    themePreference: 'light' | 'dark' | 'system';
    languagePreference: string;
  };
  privacy: {
    profileVisibility: 'public' | 'registered_buyers' | 'hidden';
    showContactInformation: boolean;
  };
  account: {
    accountDeletionRequested: boolean;
  };
}

// â”€â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SellerState {
  profile: SellerProfile;
  settings: SellerSettings;
  stats: SellerDashboardStats;
  recentActivity: SellerActivity[];
  listings: SellerListing[];
  enquiries: SellerEnquiry[];
  conversations: SellerConversation[];
  notifications: SellerNotification[];

  // Activity actions
  markActivityAsRead: (id: string) => void;
  markAllActivityAsRead: () => void;
  updateStats: (updates: Partial<SellerDashboardStats>) => void;
  addActivity: (activity: Omit<SellerActivity, 'id' | 'date' | 'read'>) => void;

  // Listing actions
  createListing: (data: Omit<SellerListing, 'id' | 'views' | 'enquiries' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  uploadListingMedia: (listingId: string, file: File, type: 'PHOTO' | 'VIDEO') => Promise<void>;
  updateListing: (id: string, updates: Partial<Omit<SellerListing, 'id' | 'createdAt'>>) => Promise<void>;
  deleteListing: (id: string) => void;
  archiveListing: (id: string) => void;
  publishListing: (id: string) => void;
  submitListing: (id: string) => Promise<void>;
  setCoverMedia: (listingId: string, mediaId: string) => Promise<void>;
  removeCoverMedia: (listingId: string) => Promise<void>;
  markListingAsSold: (id: string) => Promise<void>;
  markListingAsActive: (id: string) => Promise<void>;
  restoreListing: (id: string) => void;
  duplicateListing: (id: string) => string;

  // Enquiry actions
  updateEnquiryStatus: (id: string, status: SellerEnquiryStatus) => void;
  addEnquiryResponse: (id: string, message: string, attachments?: EnquiryAttachment[]) => void;
  markEnquiryAsRead: (id: string) => void;
  markAllEnquiriesAsRead: () => void;
  closeEnquiry: (id: string) => void;
  rejectEnquiry: (id: string) => void;
  deleteEnquiry: (id: string) => void;
  setEnquiryPriority: (id: string, priority: SellerEnquiryPriority) => void;

  // Conversation / messaging actions
  sendSellerMessage: (conversationId: string, message: string, attachments?: SellerMessageAttachment[]) => void;
  markConversationAsRead: (id: string) => void;
  markAllConversationsAsRead: () => void;
  archiveConversation: (id: string) => void;
  restoreConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  startConversation: (data: Omit<SellerConversation, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'lastMessage' | 'lastMessageAt' | 'unreadCount' | 'status'> & { initialMessage: string }) => string;

  // Notification actions
  addSellerNotification: (notification: Omit<SellerNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  fetchEnquiries: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchListings: () => Promise<void>;
  deleteAllReadNotifications: () => void;
  clearAllNotifications: () => void;

  // Profile & Settings actions
  updateSellerProfile: (profileData: Partial<SellerProfile>) => void;
  updateSellerSettings: (settingsData: Partial<SellerSettings>) => void;
  initSellerSettings: () => Promise<void>;
  requestSellerAccountDeletion: () => void;
  cancelSellerAccountDeletion: () => void;
}

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const initialProfile: SellerProfile = {
  id: 'seller-1',
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  phone: '+1 (555) 123-4567',
  companyName: 'Jenkins Tech Brokers',
  jobTitle: 'Senior M&A Advisor',
  location: 'San Francisco, CA',
  bio: 'Specializing in SaaS and AI startups with $1M+ ARR. Over 10 years of experience helping founders exit successfully.',
  sellerType: 'broker',
  website: 'https://example.com',
  linkedin: 'https://linkedin.com/in/sarahjenkins',
  yearsOfExperience: '10+',
  preferredCategories: ['SaaS', 'E-commerce', 'AI/ML'],
  preferredLocations: ['North America', 'Europe'],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const initialSettings: SellerSettings = {
  notifications: {
    emailNotifications: true,
    enquiryNotifications: true,
    messageNotifications: true,
    listingNotifications: false,
    marketingEmails: false,
    pushNotifications: true,
  },
  preferences: {
    themePreference: 'system',
    languagePreference: 'en',
  },
  privacy: {
    profileVisibility: 'registered_buyers',
    showContactInformation: false,
  },
  account: {
    accountDeletionRequested: false,
  },
};

export const initialStats: SellerDashboardStats = {
  totalEnquiries: 45,
  unreadMessages: 3,
  profileCompletion: 85,
};

export const initialActivity: SellerActivity[] = [];

export const initialListings: SellerListing[] = [];

// â”€â”€â”€ Mock Enquiries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const initialEnquiries: SellerEnquiry[] = [];

// â”€â”€â”€ Mock Conversations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const initialConversations: SellerConversation[] = [];

// â”€â”€â”€ Mock Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const initialNotifications: SellerNotification[] = [];

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const generateId = () => `lst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const generateResponseId = () => `resp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const generateActivityId = () => `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

// â”€â”€â”€ Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const generateMsgId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const generateConvId = () => `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const generateNotifId = () => `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// â”€â”€â”€ Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      settings: initialSettings,
      stats: initialStats,
      recentActivity: initialActivity,
      listings: initialListings,
      enquiries: initialEnquiries,
      conversations: initialConversations,
      notifications: initialNotifications,

      // â”€â”€ Activity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      markActivityAsRead: (id) =>
        set((state) => ({
          recentActivity: state.recentActivity.map((act) =>
            act.id === id ? { ...act, read: true } : act
          ),
        })),

      markAllActivityAsRead: () =>
        set((state) => ({
          recentActivity: state.recentActivity.map((act) => ({ ...act, read: true })),
        })),

      updateStats: (updates) =>
        set((state) => ({
          stats: { ...state.stats, ...updates },
        })),

      addActivity: (activity) =>
        set((state) => ({
          recentActivity: [
            {
              ...activity,
              id: generateActivityId(),
              date: now(),
              read: false,
            },
            ...state.recentActivity,
          ].slice(0, 20), // cap at 20
        })),

      // â”€â”€ Listing Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      createListing: async (data) => {
        // Map frontend data structure to backend DTO
        const payload = {
          type: 'SALE', // Defaulting to SALE, could be dynamic
          category: data.category,
          title: data.title,
          description: data.description,
          priceOrRent: data.askingPrice,
          currency: 'USD',
          locationArea: data.location,
          locationPostcode: 'N/A', // Defaulting as frontend has single location field
          turnover: data.revenue,
          netProfit: data.profit,
          establishedYear: data.establishedYear,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          ndaRequired: data.ndaRequired,
        };

        const response: any = await apiClient.post('/listings', payload);
        const id = response.id;

        // Add to local state
        const listing: SellerListing = {
          ...data,
          id,
          views: 0,
          enquiries: 0,
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ listings: [listing, ...state.listings] }));

        get().addActivity({
          type: 'listing',
          title: 'Listing Created',
          description: `Your listing "${data.title}" has been created.`,
        });

        return id;
      },

      uploadListingMedia: async (listingId: string, file: File, type: 'PHOTO' | 'VIDEO') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await apiClient.upload(`/listings/${listingId}/media`, formData);

        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === listingId ? { ...l, media: [...(l.media || []), response as any] } : l
          )
        }));

        // Optional: you could update the local listing state with the returned media URL
        get().addActivity({
          type: 'listing',
          title: 'Media Uploaded',
          description: `Media uploaded successfully for your listing.`,
        });
      },

      updateListing: async (id, updates) => {
        try {
          const payload: any = {};
          if (updates.category !== undefined) payload.category = updates.category;
          if (updates.title !== undefined) payload.title = updates.title;
          if (updates.description !== undefined) payload.description = updates.description;
          if (updates.askingPrice !== undefined) payload.priceOrRent = updates.askingPrice;
          if (updates.location !== undefined) payload.locationArea = updates.location;
          if (updates.revenue !== undefined) payload.turnover = updates.revenue;
          if (updates.profit !== undefined) payload.netProfit = updates.profit;
          if (updates.establishedYear !== undefined) payload.establishedYear = updates.establishedYear;
          if (updates.contactName !== undefined) payload.contactName = updates.contactName;
          if (updates.contactEmail !== undefined) payload.contactEmail = updates.contactEmail;
          if (updates.contactPhone !== undefined) payload.contactPhone = updates.contactPhone;
          if (updates.ndaRequired !== undefined) payload.ndaRequired = updates.ndaRequired;

          if (Object.keys(payload).length > 0) {
            await apiClient.patch(`/listings/${id}`, payload);
          }

          set((state) => ({
            listings: state.listings.map((l) => {
              if (l.id === id) {
                const isPublic = ['PUBLISHED', 'active', 'CHANGES_PENDING_REVIEW', 'SOLD_LET', 'sold'].includes(l.status);
                return {
                  ...l,
                  ...updates,
                  status: isPublic ? 'CHANGES_PENDING_REVIEW' : l.status,
                  updatedAt: now()
                };
              }
              return l;
            }),
          }));
        } catch (error) {
          console.error('Failed to update listing', error);
          throw error;
        }
      },

      deleteListing: (id) => {
        const listing = get().listings.find((l) => l.id === id);
        set((state) => ({ listings: state.listings.filter((l) => l.id !== id) }));
        if (listing) {
          get().addActivity({
            type: 'system',
            title: 'Listing Deleted',
            description: `Your listing "${listing.title}" has been permanently deleted.`,
          });
        }
      },

      archiveListing: (id) => {
        const listing = get().listings.find((l) => l.id === id);
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, status: 'archived', updatedAt: now() } : l
          ),
        }));
        if (listing) {
          get().addActivity({
            type: 'listing',
            title: 'Listing Archived',
            description: `Your listing "${listing.title}" has been archived.`,
          });
        }
      },

      publishListing: (id) => {
        const listing = get().listings.find((l) => l.id === id);
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, status: 'active', updatedAt: now() } : l
          ),
        }));
        if (listing) {
          get().addActivity({
            type: 'system',
            title: 'Listing Published',
            description: `Your listing "${listing.title}" is now live on the marketplace.`,
          });
        }
      },

      submitListing: async (id) => {
        try {
          await apiClient.post(`/listings/${id}/submit`, {});
          const listing = get().listings.find((l) => l.id === id);
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === id ? { ...l, status: 'pending', updatedAt: now() } : l
            ),
          }));
          if (listing) {
            get().addActivity({
              type: 'system',
              title: 'Listing Submitted for Review',
              description: `Your listing "${listing.title}" has been submitted and is pending admin approval.`,
            });
          }
        } catch (error) {
          console.error('Failed to submit listing', error);
        }
      },

      setCoverMedia: async (listingId: string, mediaId: string) => {
        try {
          await apiClient.patch(`/listings/${listingId}/media/${mediaId}/cover`, {});
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === listingId ? { ...l, coverMediaId: mediaId, updatedAt: now() } : l
            ),
          }));
          get().addActivity({
            type: 'listing',
            title: 'Cover Image Updated',
            description: `The cover image for your listing has been updated.`,
          });
        } catch (error) {
          console.error('Failed to set cover media', error);
          throw error;
        }
      },

      removeCoverMedia: async (listingId: string) => {
        try {
          await apiClient.delete(`/listings/${listingId}/cover`);
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === listingId ? { ...l, coverMediaId: undefined, updatedAt: now() } : l
            ),
          }));
        } catch (error) {
          console.error('Failed to remove cover media', error);
          throw error;
        }
      },

      markListingAsSold: async (id) => {
        try {
          await apiClient.post(`/listings/${id}/sold`, {});
          const listing = get().listings.find((l) => l.id === id);
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === id ? { ...l, status: 'sold', updatedAt: now() } : l
            ),
          }));
          if (listing) {
            get().addActivity({
              type: 'system',
              title: 'Listing Marked as Sold',
              description: `Congratulations! "${listing.title}" has been marked as sold.`,
            });
          }
          queryClient.invalidateQueries({ queryKey: ['listings'] });
        } catch (error) {
          console.error('Failed to mark listing as sold', error);
          throw error;
        }
      },

      markListingAsActive: async (id) => {
        try {
          await apiClient.post(`/listings/${id}/active`, {});
          const listing = get().listings.find((l) => l.id === id);
          set((state) => ({
            listings: state.listings.map((l) =>
              l.id === id ? { ...l, status: 'active', updatedAt: now() } : l
            ),
          }));
          if (listing) {
            get().addActivity({
              type: 'system',
              title: 'Listing Marked as Active',
              description: `"${listing.title}" is now active again.`,
            });
          }
          queryClient.invalidateQueries({ queryKey: ['listings'] });
        } catch (error) {
          console.error('Failed to mark listing as active', error);
          throw error;
        }
      },

      restoreListing: (id) => {
        const listing = get().listings.find((l) => l.id === id);
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, status: 'draft', updatedAt: now() } : l
          ),
        }));
        if (listing) {
          get().addActivity({
            type: 'listing',
            title: 'Listing Restored',
            description: `Your listing "${listing.title}" has been restored as a draft.`,
          });
        }
      },

      duplicateListing: (id) => {
        const original = get().listings.find((l) => l.id === id);
        if (!original) return '';
        const newId = generateId();
        const duplicate: SellerListing = {
          ...original,
          id: newId,
          title: `${original.title} (Copy)`,
          status: 'draft',
          views: 0,
          enquiries: 0,
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({ listings: [duplicate, ...state.listings] }));
        get().addActivity({
          type: 'listing',
          title: 'Listing Duplicated',
          description: `A copy of "${original.title}" has been created as a draft.`,
        });
        return newId;
      },

      // â”€â”€ Enquiry Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      updateEnquiryStatus: async (id, status) => {
        await apiClient.patch<any>(`/enquiries/${id}`, { status });
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      addEnquiryResponse: (id, message, attachments = []) => {
        const enquiry = get().enquiries.find((e) => e.id === id);
        if (!enquiry) return;
        const response: EnquiryResponse = {
          id: generateResponseId(),
          enquiryId: id,
          senderType: 'seller',
          senderName: 'You',
          message,
          createdAt: now(),
          attachments,
        };
        const timestamp = now();
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id
              ? {
                  ...e,
                  responses: [...e.responses, response],
                  status: e.status === 'new' ? 'contacted' : e.status,
                  updatedAt: timestamp,
                  lastResponseAt: timestamp,
                  unreadCount: 0,
                }
              : e
          ),
        }));
        get().addActivity({
          type: 'enquiry',
          title: 'Response Sent',
          description: `You responded to ${enquiry.buyerName}'s enquiry for "${enquiry.listingTitle}".`,
        });
      },

      markEnquiryAsRead: (id) =>
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, unreadCount: 0 } : e
          ),
        })),

      markAllEnquiriesAsRead: () =>
        set((state) => ({
          enquiries: state.enquiries.map((e) => ({ ...e, unreadCount: 0 })),
        })),

      closeEnquiry: (id) => {
        const enquiry = get().enquiries.find((e) => e.id === id);
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, status: 'closed', updatedAt: now() } : e
          ),
        }));
        if (enquiry) {
          get().addActivity({
            type: 'enquiry',
            title: 'Enquiry Closed',
            description: `Enquiry from ${enquiry.buyerName} for "${enquiry.listingTitle}" has been closed.`,
          });
        }
      },

      rejectEnquiry: (id) => {
        const enquiry = get().enquiries.find((e) => e.id === id);
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, status: 'rejected', updatedAt: now() } : e
          ),
        }));
        if (enquiry) {
          get().addActivity({
            type: 'enquiry',
            title: 'Enquiry Rejected',
            description: `Enquiry from ${enquiry.buyerName} for "${enquiry.listingTitle}" has been rejected.`,
          });
        }
      },

      deleteEnquiry: (id) => {
        const enquiry = get().enquiries.find((e) => e.id === id);
        set((state) => ({
          enquiries: state.enquiries.filter((e) => e.id !== id),
        }));
        if (enquiry) {
          get().addActivity({
            type: 'enquiry',
            title: 'Enquiry Deleted',
            description: `Enquiry from ${enquiry.buyerName} has been permanently deleted.`,
          });
        }
      },

      setEnquiryPriority: (id, priority) =>
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, priority, updatedAt: now() } : e
          ),
        })),

      // â”€â”€ Conversation / Messaging Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      sendSellerMessage: (conversationId, message, attachments = []) => {
        const conversation = get().conversations.find((c) => c.id === conversationId);
        if (!conversation) return;
        const newMsg: SellerMessage = {
          id: generateMsgId(),
          conversationId,
          senderType: 'seller',
          senderName: 'You',
          message,
          attachments,
          createdAt: now(),
          isRead: true,
        };
        const timestamp = now();
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, newMsg],
                  lastMessage: message,
                  lastMessageAt: timestamp,
                  updatedAt: timestamp,
                  unreadCount: 0,
                }
              : c
          ),
        }));
        get().addActivity({
          type: 'message',
          title: 'Message Sent',
          description: `You replied to ${conversation.buyerName} regarding "${conversation.listingTitle}".`,
        });
      },

      markConversationAsRead: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, isRead: true })) } : c
          ),
        })),

      markAllConversationsAsRead: () =>
        set((state) => ({
          conversations: state.conversations.map((c) => ({
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) => ({ ...m, isRead: true })),
          })),
        })),

      archiveConversation: (id) => {
        const conversation = get().conversations.find((c) => c.id === id);
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, status: 'archived', updatedAt: now() } : c
          ),
        }));
        if (conversation) {
          get().addActivity({
            type: 'message',
            title: 'Conversation Archived',
            description: `Conversation with ${conversation.buyerName} has been archived.`,
          });
        }
      },

      restoreConversation: (id) => {
        const conversation = get().conversations.find((c) => c.id === id);
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, status: 'active', updatedAt: now() } : c
          ),
        }));
        if (conversation) {
          get().addActivity({
            type: 'message',
            title: 'Conversation Restored',
            description: `Conversation with ${conversation.buyerName} has been restored.`,
          });
        }
      },

      deleteConversation: (id) => {
        const conversation = get().conversations.find((c) => c.id === id);
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        }));
        if (conversation) {
          get().addActivity({
            type: 'message',
            title: 'Conversation Deleted',
            description: `Conversation with ${conversation.buyerName} has been permanently deleted.`,
          });
        }
      },

      startConversation: (data) => {
        const id = generateConvId();
        const timestamp = now();
        const firstMsg: SellerMessage = {
          id: generateMsgId(),
          conversationId: id,
          senderType: 'seller',
          senderName: 'You',
          message: data.initialMessage,
          attachments: [],
          createdAt: timestamp,
          isRead: true,
        };
        const conversation: SellerConversation = {
          ...data,
          id,
          lastMessage: data.initialMessage,
          lastMessageAt: timestamp,
          unreadCount: 0,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
          messages: [firstMsg],
        };
        set((state) => ({ conversations: [conversation, ...state.conversations] }));
        get().addActivity({
          type: 'message',
          title: 'Conversation Started',
          description: `New conversation started with ${data.buyerName} regarding "${data.listingTitle}".`,
        });
        return id;
      },

      // â”€â”€ Notification Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      addSellerNotification: (notification) => {
        const newNotif: SellerNotification = {
          ...notification,
          id: generateNotifId(),
          createdAt: now(),
          isRead: false,
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      deleteAllReadNotifications: () =>
        set((state) => ({
          notifications: state.notifications.filter((n) => !n.isRead),
        })),

      clearAllNotifications: () =>
        set({ notifications: [] }),

      // â”€â”€ Profile & Settings Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

      updateSellerProfile: (profileData) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...profileData,
            updatedAt: now(),
          },
        }));
        get().addActivity({
          type: 'system',
          title: 'Profile Updated',
          description: 'Your seller profile was updated successfully.',
        });
      },

      updateSellerSettings: async (settingsData) => {
        const currentSettings = get().settings;
        const newSettings = {
          notifications: { ...currentSettings.notifications, ...(settingsData.notifications || {}) },
          preferences: { ...currentSettings.preferences, ...(settingsData.preferences || {}) },
          privacy: { ...currentSettings.privacy, ...(settingsData.privacy || {}) },
          account: { ...currentSettings.account, ...(settingsData.account || {}) },
        };
        
        try {
          await apiClient.patch('/users/me/settings', { sellerSettings: newSettings });
        } catch (e) {
          console.error('Failed to update seller settings', e);
        }

        set(() => ({ settings: newSettings }));
        
        get().addActivity({
          type: 'system',
          title: 'Settings Saved',
          description: 'Your account settings were updated.',
        });
      },

      initSellerSettings: async () => {
        try {
          const user = await apiClient.get<any>('/users/me');
          if (user?.settings?.sellerSettings && typeof user.settings.sellerSettings === 'object') {
            const settingsData = user.settings.sellerSettings;
            const currentSettings = get().settings;
            set(() => ({
              settings: {
                notifications: { ...currentSettings.notifications, ...(settingsData.notifications || {}) },
                preferences: { ...currentSettings.preferences, ...(settingsData.preferences || {}) },
                privacy: { ...currentSettings.privacy, ...(settingsData.privacy || {}) },
                account: { ...currentSettings.account, ...(settingsData.account || {}) },
              },
            }));
          }
        } catch (e) {
          console.error('Failed to fetch seller settings', e);
        }
      },

      requestSellerAccountDeletion: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            account: { ...state.settings.account, accountDeletionRequested: true },
          },
        }));
        get().addSellerNotification({
          type: 'system',
          priority: 'high',
          title: 'Account Deletion Requested',
          message: 'Your account deletion request is being processed. This is a frontend mock action.',
        });
      },

      cancelSellerAccountDeletion: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            account: { ...state.settings.account, accountDeletionRequested: false },
          },
        }));
        get().addSellerNotification({
          type: 'system',
          priority: 'low',
          title: 'Deletion Request Cancelled',
          message: 'Your account deletion request has been cancelled.',
        });
      },

      fetchEnquiries: async () => {
        const data = await apiClient.get<any[]>('/enquiries');
        set({ enquiries: data });
      },
      fetchConversations: async () => {
        const data = await apiClient.get<any[]>('/conversations');
        set({ conversations: data });
      },
      fetchListings: async () => {
        const data = await apiClient.get<any[]>('/listings/my');
        // Map backend data to UI format
        const statusMap: Record<string, string> = {
          DRAFT: 'draft',
          SUBMITTED_FOR_REVIEW: 'pending',
          PUBLISHED: 'active',
          SOLD_LET: 'sold',
          PAUSED: 'archived',
          EXPIRED: 'archived',
          REJECTED: 'rejected'
        };

        const mapped = data.map((l: any) => ({
          ...l,
          status: statusMap[l.status] || l.status,
          askingPrice: l.priceOrRent || 0,
          currency: l.currency || 'USD',
          image: l.media && l.media.length > 0 ? l.media[0].url : undefined,
          images: l.media ? l.media.map((m: any) => m.url) : [],
          views: l.views || 0,
          enquiries: l.enquiries || 0,
          title: l.title || 'Untitled',
          category: l.category || 'Uncategorized',
          location: l.locationArea || 'Unknown Location',
          description: l.description || '',
          revenue: l.turnover,
          profit: l.netProfit,
          createdAt: l.createdAt || new Date().toISOString(),
          updatedAt: l.updatedAt || new Date().toISOString(),
        }));
        set({ listings: mapped });
      },
    }),
    {
      name: 'infybuys-seller-storage',
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
        stats: state.stats,
        recentActivity: state.recentActivity,
        listings: state.listings,
        enquiries: state.enquiries,
        conversations: state.conversations,
        notifications: state.notifications,
      }),
    }
  )
);
