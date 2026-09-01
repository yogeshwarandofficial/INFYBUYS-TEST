// Removed mock data imports
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/apiClient';

import type { SearchFilters } from '@/hooks/useListingSearch';

export type EnquiryStatus = 'new' | 'sent' | 'responded' | 'closed';

export interface EnquiryResponse {
  id: string;
  message: string;
  respondedAt: string;
}

export interface BuyerEnquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerName: string;
  sellerAvatar?: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  response?: EnquiryResponse;
}

export type NotificationType = 'enquiry' | 'saved-search' | 'listing' | 'account' | 'system' | 'message' | 'nda';

export interface BuyerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedPath?: string;
  relatedId?: string;
}

export interface BuyerActivity {
  id: string;
  type: 'saved' | 'enquiry' | 'nda' | 'viewed' | 'message';
  description: string;
  time: string;
  listingId?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastRunAt: string | null;
  resultCount: number;
  alertEnabled: boolean;
}

// ----------------------------------------------------------------------
// Phase 4.6 - Messaging Models
// ----------------------------------------------------------------------

export type ConversationStatus = 'active' | 'archived' | 'closed';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface MessageAttachment {
  id: string;
  name: string;
  type: string; // e.g., 'image/jpeg', 'application/pdf'
  size: number; // in bytes
  url: string; // Data URL or object URL for preview
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'buyer' | 'seller';
  senderName: string;
  content: string;
  attachments?: MessageAttachment[];
  createdAt: string;
  readAt?: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  businessName: string;
  businessImage?: string;
  sellerName: string;
  sellerAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// Phase 4.7 - NDA Models
// ----------------------------------------------------------------------

export type NDAStatus = 'draft' | 'pending' | 'under-review' | 'approved' | 'rejected' | 'expired' | 'cancelled';
export type NDAType = 'standard' | 'custom';

export interface BuyerNDA {
  id: string;
  listingId: string;
  listingTitle: string;
  businessName: string;
  sellerName: string;
  type: NDAType;
  status: NDAStatus;
  requestedAt: string;
  updatedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  purpose?: string;
  message?: string;
  documentName?: string;
  documentSize?: string;
  documentType?: string;
  rejectionReason?: string;
  version: number;
}

// ----------------------------------------------------------------------
// Phase 4.8 - Subscription & Billing Models
// ----------------------------------------------------------------------

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    savedSearches: number; // -1 for unlimited
    enquiries: number;     // -1 for unlimited
    ndaAccess: boolean;
    messaging: boolean;
  };
  popular?: boolean;
}

export interface BuyerSubscription {
  id: string;
  planId: string;
  status: 'active' | 'trial' | 'past-due' | 'cancelled' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  startedAt: string;
  renewalDate?: string;
  cancelledAt?: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
}

export interface BillingRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  planName: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

// ----------------------------------------------------------------------
// Phase 4.9 - Buyer Profile & Settings Models
// ----------------------------------------------------------------------

export interface BuyerProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  company: string;
  jobTitle: string;
  location: string;
  bio: string;
  buyerType: 'Individual' | 'Corporate' | 'Private Equity' | 'Search Fund';
  website: string;
  linkedin: string;
}

export interface BuyerSettings {
  emailNotifications: boolean;
  savedSearchAlerts: boolean;
  enquiryNotifications: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  themePreference: 'light' | 'dark' | 'system';
  languagePreference: string;
}


// ----------------------------------------------------------------------
// Phase 6.14 - Buyer Reviews Models
// ----------------------------------------------------------------------

export interface BuyerReview {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'published' | 'pending' | 'rejected';
}

interface BuyerState {
  // Mock counts
  savedCount: number;
  savedSearchesCount: number;
  enquiryCount: number;
  unreadMessageCount: number;
  notificationCount: number;
  recentActivity: BuyerActivity[];

  // Persisted state
  favorites: string[];
  searchHistory: string[];
  viewMode: 'grid' | 'list';
  savedSearches: SavedSearch[];
  enquiries: BuyerEnquiry[];
  notifications: BuyerNotification[];

  // Messaging state
  conversations: Conversation[];
  messages: Record<string, Message[]>; // mapping conversationId to messages

  // NDA state
  ndas: BuyerNDA[];

  // Phase 4.8 - Subscription & Billing state
  plans: SubscriptionPlan[];
  subscription: BuyerSubscription | null;
  billingHistory: BillingRecord[];
  paymentMethods: PaymentMethod[];
  selectedPlanId: string | null;

  // Phase 4.9 - Profile & Settings state
  profile: BuyerProfile;
  settings: BuyerSettings;

  // Phase 6.14 - Reviews
  reviews: BuyerReview[];

  // Actions
  setCounts: (counts: Partial<Pick<BuyerState, 'savedCount' | 'savedSearchesCount' | 'enquiryCount' | 'unreadMessageCount' | 'notificationCount'>>) => void;
  addActivity: (activity: Omit<BuyerActivity, 'id' | 'time'>) => void;
  toggleFavorite: (id: string) => void;
  addSearchHistory: (term: string) => void;
  removeSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // Saved Searches Actions
  saveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastRunAt' | 'resultCount'>, resultCount: number) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  deleteSavedSearch: (id: string) => void;
  toggleSearchAlert: (id: string) => void;

  // Enquiry Actions
  createEnquiry: (enquiry: Omit<BuyerEnquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateEnquiry: (id: string, updates: Partial<BuyerEnquiry>) => void;
  closeEnquiry: (id: string) => void;
  addMockSellerResponse: (id: string, responseMessage: string) => void;

  // Notification Actions
  addNotification: (notification: Omit<BuyerNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;

  // Messaging Actions
  createConversation: (conversation: Omit<Conversation, 'id' | 'lastMessage' | 'lastMessageAt' | 'unreadCount' | 'status' | 'createdAt' | 'updatedAt'>) => string;
  sendMessage: (conversationId: string, content: string, attachments?: MessageAttachment[]) => void;
  addMockSellerReply: (conversationId: string, replyContent: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  markMessageAsRead: (conversationId: string, messageId: string) => void;
  markAllMessagesAsRead: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  clearConversation: (conversationId: string) => void;

  // NDA Actions
  requestNDA: (nda: Omit<BuyerNDA, 'id' | 'status' | 'requestedAt' | 'updatedAt' | 'version'>) => string;
  updateNDA: (id: string, updates: Partial<BuyerNDA>) => void;
  approveMockNDA: (id: string) => void;
  rejectMockNDA: (id: string, reason: string) => void;
  cancelNDA: (id: string) => void;
  expireNDA: (id: string) => void;
  deleteNDA: (id: string) => void;
  incrementNDAVersion: (id: string) => void;

  // Phase 4.8 - Subscription & Billing Actions
  selectSubscriptionPlan: (planId: string) => void;
  startMockCheckout: () => void;
  completeMockPayment: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  failMockPayment: () => void;
  upgradeSubscription: (planId: string) => void;
  downgradeSubscription: (planId: string) => void;
  cancelSubscription: () => void;
  resumeSubscription: () => void;
  toggleAutoRenew: () => void;

  addBillingRecord: (record: Omit<BillingRecord, 'id' | 'invoiceNumber'>) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // Phase 4.9 - Profile & Settings Actions
  updateProfile: (updates: Partial<BuyerProfile>) => void;
  updateSettings: (updates: Partial<BuyerSettings>) => void;
  deleteAccountRequest: () => void;

  // Phase 6.14 - Reviews Actions
  createReview: (review: Omit<BuyerReview, 'id' | 'createdAt' | 'status'>) => void;
  updateReview: (id: string, updates: Partial<BuyerReview>) => void;
  deleteReview: (id: string) => void;
  fetchEnquiries: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
}

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [];

export const mockSubscription: BuyerSubscription | null = null;

export const mockBillingHistory: BillingRecord[] = [];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
];

export const initialProfile: BuyerProfile = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://i.pravatar.cc/150?u=buyer_john',
  company: 'Acme Investments LLC',
  jobTitle: 'Managing Partner',
  location: 'San Francisco, CA',
  bio: 'Experienced investor looking for profitable B2B SaaS businesses in the healthcare and fintech sectors. Typical deal size $1M - $5M.',
  buyerType: 'Private Equity',
  website: 'https://acmeinvestments.mock',
  linkedin: 'https://linkedin.com/in/johndoe',
};

export const initialSettings: BuyerSettings = {
  emailNotifications: true,
  savedSearchAlerts: true,
  enquiryNotifications: true,
  messageNotifications: true,
  marketingEmails: false,
  pushNotifications: false,
  themePreference: 'system',
  languagePreference: 'en',
};

export const mockReviews: BuyerReview[] = [];

export const useBuyerStore = create<BuyerState>()(
  persist(
    (set, get) => ({
      savedCount: 0,
      savedSearchesCount: 0,
      enquiryCount: 0,
      unreadMessageCount: 0,
      notificationCount: 0,
      recentActivity: [],

      favorites: [],
      searchHistory: [],
      viewMode: 'grid',
      savedSearches: [],
      enquiries: [],
      notifications: [],

      conversations: [],
      messages: {},

      ndas: [],

      plans: [],
      subscription: mockSubscription,
      billingHistory: mockBillingHistory,
      paymentMethods: mockPaymentMethods,
      selectedPlanId: null,

      profile: initialProfile,
      settings: initialSettings,
      reviews: mockReviews,

      setCounts: (newCounts) => set((state) => ({ ...state, ...newCounts })),

      addActivity: (activity) => set((state) => ({
        recentActivity: [
          { ...activity, id: `act-${Date.now()}`, time: 'Just now' },
          ...state.recentActivity.slice(0, 9)
        ]
      })),

      toggleFavorite: (id) => set((state) => {
        const isFav = state.favorites.includes(id);
        const newFavorites = isFav
          ? state.favorites.filter((favId) => favId !== id)
          : [...state.favorites, id];

        return {
          favorites: newFavorites,
          savedCount: newFavorites.length
        };
      }),

      addSearchHistory: (term) => set((state) => {
        if (!term.trim()) return state;
        const filtered = state.searchHistory.filter((t) => t.toLowerCase() !== term.toLowerCase());
        return {
          searchHistory: [term, ...filtered].slice(0, 5) // keep last 5 searches
        };
      }),

      removeSearchHistory: (term) => set((state) => ({
        searchHistory: state.searchHistory.filter((t) => t !== term)
      })),

      clearSearchHistory: () => set({ searchHistory: [] }),

      setViewMode: (mode) => set({ viewMode: mode }),

      saveSearch: (search, resultCount) => set((state) => ({
        savedSearches: [
          {
            ...search,
            id: `search-${Date.now()}`,
            createdAt: new Date().toISOString(),
            lastRunAt: new Date().toISOString(),
            resultCount,
          },
          ...state.savedSearches
        ]
      })),

      updateSavedSearch: (id, updates) => set((state) => ({
        savedSearches: state.savedSearches.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteSavedSearch: (id) => set((state) => ({
        savedSearches: state.savedSearches.filter(s => s.id !== id),
        savedSearchesCount: state.savedSearchesCount > 0 ? state.savedSearchesCount - 1 : 0
      })),

      toggleSearchAlert: (id) => set((state) => ({
        savedSearches: state.savedSearches.map(s =>
          s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
        )
      })),

      createEnquiry: (enquiryData) => set((state) => {
        const newEnquiry: BuyerEnquiry = {
          ...enquiryData,
          id: `enq-${Date.now()}`,
          status: 'sent',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          enquiries: [newEnquiry, ...state.enquiries],
          enquiryCount: state.enquiryCount + 1,
        };
      }),

      updateEnquiry: (id, updates) => set((state) => ({
        enquiries: state.enquiries.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e)
      })),

      closeEnquiry: (id) => set((state) => ({
        enquiries: state.enquiries.map(e => e.id === id ? { ...e, status: 'closed', updatedAt: new Date().toISOString() } : e)
      })),

      addMockSellerResponse: (id, responseMessage) => set((state) => {
        const updatedEnquiries = state.enquiries.map(e => {
          if (e.id === id) {
            return {
              ...e,
              status: 'responded' as const,
              updatedAt: new Date().toISOString(),
              response: {
                id: `resp-${Date.now()}`,
                message: responseMessage,
                respondedAt: new Date().toISOString(),
              }
            };
          }
          return e;
        });

        const newNotification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'enquiry',
          title: 'Seller responded to your enquiry',
          message: `A seller has responded to your enquiry.`,
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: `/buyer/enquiries/${id}`,
          relatedId: id,
        };

        return {
          enquiries: updatedEnquiries,
          notifications: [newNotification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      addNotification: (notification) => set((state) => {
        const newNotif: BuyerNotification = {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        return {
          notifications: [newNotif, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      markNotificationAsRead: (id) => set((state) => {
        const notif = state.notifications.find(n => n.id === id);
        if (!notif || notif.read) return state;

        return {
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
          notificationCount: Math.max(0, state.notificationCount - 1),
        };
      }),

      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        notificationCount: 0,
      })),

      deleteNotification: (id) => set((state) => {
        const notif = state.notifications.find(n => n.id === id);
        if (!notif) return state;

        return {
          notifications: state.notifications.filter(n => n.id !== id),
          notificationCount: notif.read ? state.notificationCount : Math.max(0, state.notificationCount - 1),
        };
      }),

      clearNotifications: () => set({ notifications: [], notificationCount: 0 }),

      // ----------------------------------------------------------------------
      // Messaging Actions
      // ----------------------------------------------------------------------

      createConversation: (conversationData) => {
        const id = `conv-${Date.now()}`;
        const newConversation: Conversation = {
          ...conversationData,
          id,
          lastMessage: '',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          messages: { ...state.messages, [id]: [] },
        }));

        return id;
      },

      sendMessage: (conversationId, content, attachments) => set((state) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'buyer',
          senderRole: 'buyer',
          senderName: 'You',
          content,
          attachments,
          createdAt: new Date().toISOString(),
          status: 'sent',
        };

        const convMessages = state.messages[conversationId] || [];

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: content,
              lastMessageAt: newMessage.createdAt,
              updatedAt: newMessage.createdAt,
            };
          }
          return c;
        });

        updatedConversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

        return {
          messages: {
            ...state.messages,
            [conversationId]: [...convMessages, newMessage],
          },
          conversations: updatedConversations,
        };
      }),

      addMockSellerReply: (conversationId, replyContent) => set((state) => {
        const conv = state.conversations.find(c => c.id === conversationId);
        if (!conv) return state;

        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'seller',
          senderRole: 'seller',
          senderName: conv.sellerName,
          content: replyContent,
          createdAt: new Date().toISOString(),
          status: 'delivered',
        };

        const convMessages = state.messages[conversationId] || [];

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: replyContent,
              lastMessageAt: newMessage.createdAt,
              updatedAt: newMessage.createdAt,
              unreadCount: c.unreadCount + 1,
            };
          }
          return c;
        });

        updatedConversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

        const notification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'message',
          title: `New message from ${conv.sellerName}`,
          message: `Regarding ${conv.listingTitle}`,
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: `/buyer/messages/${conversationId}`,
          relatedId: conversationId,
        };

        return {
          messages: {
            ...state.messages,
            [conversationId]: [...convMessages, newMessage],
          },
          conversations: updatedConversations,
          unreadMessageCount: state.unreadMessageCount + 1,
          notifications: [notification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      markConversationAsRead: (conversationId) => set((state) => {
        const conv = state.conversations.find(c => c.id === conversationId);
        if (!conv || conv.unreadCount === 0) return state;

        const unreadDelta = conv.unreadCount;

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return { ...c, unreadCount: 0 };
          }
          return c;
        });

        const convMessages = state.messages[conversationId] || [];
        const updatedMessages = convMessages.map(m => {
          if (m.senderRole === 'seller' && m.status !== 'read') {
            return { ...m, status: 'read' as MessageStatus, readAt: new Date().toISOString() };
          }
          return m;
        });

        return {
          conversations: updatedConversations,
          messages: {
            ...state.messages,
            [conversationId]: updatedMessages,
          },
          unreadMessageCount: Math.max(0, state.unreadMessageCount - unreadDelta),
        };
      }),

      markMessageAsRead: (conversationId, messageId) => set((state) => {
        const convMessages = state.messages[conversationId] || [];
        let wasUnread = false;

        const updatedMessages = convMessages.map(m => {
          if (m.id === messageId && m.senderRole === 'seller' && m.status !== 'read') {
            wasUnread = true;
            return { ...m, status: 'read' as MessageStatus, readAt: new Date().toISOString() };
          }
          return m;
        });

        if (!wasUnread) return state;

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return { ...c, unreadCount: Math.max(0, c.unreadCount - 1) };
          }
          return c;
        });

        return {
          messages: {
            ...state.messages,
            [conversationId]: updatedMessages,
          },
          conversations: updatedConversations,
          unreadMessageCount: Math.max(0, state.unreadMessageCount - 1),
        };
      }),

      markAllMessagesAsRead: (conversationId) => get().markConversationAsRead(conversationId),

      archiveConversation: (conversationId) => set((state) => ({
        conversations: state.conversations.map(c =>
          c.id === conversationId ? { ...c, status: 'archived', updatedAt: new Date().toISOString() } : c
        )
      })),

      unarchiveConversation: (conversationId) => set((state) => ({
        conversations: state.conversations.map(c =>
          c.id === conversationId ? { ...c, status: 'active', updatedAt: new Date().toISOString() } : c
        )
      })),

      closeConversation: (conversationId) => set((state) => ({
        conversations: state.conversations.map(c =>
          c.id === conversationId ? { ...c, status: 'closed', updatedAt: new Date().toISOString() } : c
        )
      })),

      deleteConversation: (conversationId) => set((state) => {
        const conv = state.conversations.find(c => c.id === conversationId);
        const unreadCount = conv?.unreadCount || 0;

        const newMessages = { ...state.messages };
        delete newMessages[conversationId];

        return {
          conversations: state.conversations.filter(c => c.id !== conversationId),
          messages: newMessages,
          unreadMessageCount: Math.max(0, state.unreadMessageCount - unreadCount),
        };
      }),

      clearConversation: (conversationId) => set((state) => {
        const conv = state.conversations.find(c => c.id === conversationId);
        const unreadCount = conv?.unreadCount || 0;

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return { ...c, lastMessage: '', lastMessageAt: new Date().toISOString(), unreadCount: 0 };
          }
          return c;
        });

        return {
          messages: {
            ...state.messages,
            [conversationId]: [],
          },
          conversations: updatedConversations,
          unreadMessageCount: Math.max(0, state.unreadMessageCount - unreadCount),
        };
      }),

      // ----------------------------------------------------------------------
      // NDA Actions
      // ----------------------------------------------------------------------

      requestNDA: (ndaData) => {
        const id = `nda-${Date.now()}`;
        const newNDA: BuyerNDA = {
          ...ndaData,
          id,
          status: 'pending',
          requestedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        };

        set((state) => ({
          ndas: [newNDA, ...state.ndas],
        }));

        get().addNotification({
          type: 'nda',
          title: 'NDA Request Submitted',
          message: `Your NDA request for ${ndaData.listingTitle} has been sent to the seller.`,
          relatedPath: `/buyer/nda/${id}`,
          relatedId: id,
        });

        return id;
      },

      updateNDA: (id, updates) => set((state) => ({
        ndas: state.ndas.map(nda => nda.id === id ? { ...nda, ...updates, updatedAt: new Date().toISOString() } : nda)
      })),

      approveMockNDA: (id) => set((state) => {
        const nda = state.ndas.find(n => n.id === id);
        if (!nda) return state;

        const updatedNDAs = state.ndas.map(n => {
          if (n.id === id) {
            return {
              ...n,
              status: 'approved' as const,
              updatedAt: new Date().toISOString(),
              approvedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
              documentName: `${n.businessName.replace(/\s+/g, '_')}_NDA_Signed.pdf`,
              documentSize: '245 KB',
              documentType: 'application/pdf',
            };
          }
          return n;
        });

        const newNotification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'nda',
          title: 'NDA Approved',
          message: `Your NDA request for ${nda.listingTitle} has been approved.`,
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: `/buyer/nda/${id}`,
          relatedId: id,
        };

        return {
          ndas: updatedNDAs,
          notifications: [newNotification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      rejectMockNDA: (id, reason) => set((state) => {
        const nda = state.ndas.find(n => n.id === id);
        if (!nda) return state;

        const updatedNDAs = state.ndas.map(n => {
          if (n.id === id) {
            return {
              ...n,
              status: 'rejected' as const,
              updatedAt: new Date().toISOString(),
              rejectionReason: reason,
            };
          }
          return n;
        });

        const newNotification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'nda',
          title: 'NDA Request Rejected',
          message: `Your NDA request for ${nda.listingTitle} was rejected.`,
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: `/buyer/nda/${id}`,
          relatedId: id,
        };

        return {
          ndas: updatedNDAs,
          notifications: [newNotification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      cancelNDA: (id) => set((state) => ({
        ndas: state.ndas.map(nda => nda.id === id ? { ...nda, status: 'cancelled', updatedAt: new Date().toISOString() } : nda)
      })),

      expireNDA: (id) => set((state) => ({
        ndas: state.ndas.map(nda => nda.id === id ? { ...nda, status: 'expired', updatedAt: new Date().toISOString() } : nda)
      })),

      deleteNDA: (id) => set((state) => ({
        ndas: state.ndas.filter(nda => nda.id !== id)
      })),

      incrementNDAVersion: (id) => set((state) => ({
        ndas: state.ndas.map(nda => nda.id === id ? { ...nda, version: nda.version + 1, updatedAt: new Date().toISOString() } : nda)
      })),

      // ----------------------------------------------------------------------
      // Phase 4.8 - Subscription & Billing Actions
      // ----------------------------------------------------------------------

      selectSubscriptionPlan: (planId) => set({ selectedPlanId: planId }),

      startMockCheckout: () => { }, // No-op for now, just for flow

      completeMockPayment: (_planId, _billingCycle) => set((state) => {
        return state;
      }),

      failMockPayment: () => {},

      upgradeSubscription: (planId) => get().selectSubscriptionPlan(planId), // Usually goes to checkout
      downgradeSubscription: (planId) => get().selectSubscriptionPlan(planId),

      cancelSubscription: () => set((state) => {
        return state;
      }),

      resumeSubscription: () => set((state) => {
        return state;
      }),

      toggleAutoRenew: () => set((state) => {
        return state;
      }),

      addBillingRecord: (record) => set((state) => ({
        billingHistory: [
          { ...record, id: `inv-${Date.now()}`, invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` },
          ...state.billingHistory
        ]
      })),

      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [
          { ...method, id: `pm-${Date.now()}`, isDefault: state.paymentMethods.length === 0 },
          ...state.paymentMethods
        ]
      })),

      removePaymentMethod: (id) => set((state) => {
        const remaining = state.paymentMethods.filter(pm => pm.id !== id);
        if (remaining.length > 0 && !remaining.some(pm => pm.isDefault)) {
          remaining[0].isDefault = true;
        }
        return { paymentMethods: remaining };
      }),

      setDefaultPaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id }))
      })),

      // ----------------------------------------------------------------------
      // Phase 4.9 - Profile & Settings Actions
      // ----------------------------------------------------------------------

      updateProfile: (updates) => set((state) => {
        const newNotification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'account',
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: '/buyer/profile',
        };

        return {
          profile: { ...state.profile, ...updates },
          notifications: [newNotification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      updateSettings: (updates) => set((state) => {
        const newNotification: BuyerNotification = {
          id: `notif-${Date.now()}`,
          type: 'account',
          title: 'Settings Updated',
          message: 'Your account preferences have been saved.',
          createdAt: new Date().toISOString(),
          read: false,
          relatedPath: '/buyer/settings',
        };

        return {
          settings: { ...state.settings, ...updates },
          notifications: [newNotification, ...state.notifications],
          notificationCount: state.notificationCount + 1,
        };
      }),

      deleteAccountRequest: () => {
        get().addNotification({
          type: 'account',
          title: 'Account Deletion Requested',
          message: 'Your mock account deletion request has been processed.',
          relatedPath: '/',
        });
        // The actual logout will be handled by the UI using useUserStore.logout()
      },

      createReview: (reviewData) => set((state) => {
        const newReview: BuyerReview = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'published',
        };
        return {
          reviews: [newReview, ...state.reviews]
        };
      }),

      updateReview: (id, updates) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),
      fetchEnquiries: async () => {
        const data = await apiClient.get<BuyerEnquiry[]>('/enquiries');
        set({ enquiries: data, enquiryCount: data.length });
      },
      fetchConversations: async () => {
        const data = await apiClient.get<Conversation[]>('/conversations');
        set({ conversations: data });
      },
      fetchMessages: async (conversationId: string) => {
        const data = await apiClient.get<Message[]>(`/messages/${conversationId}`);
        set((state) => ({ messages: { ...state.messages, [conversationId]: data } }));
      },

    }),
    {
      name: 'infybuys-buyer-storage',
      version: 4,
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        viewMode: state.viewMode,
        savedCount: state.favorites.length,
        savedSearches: state.savedSearches,
        savedSearchesCount: state.savedSearches.length,
        enquiries: state.enquiries,
        enquiryCount: state.enquiries.length,
        notifications: state.notifications,
        notificationCount: state.notifications.filter(n => !n.read).length,
        conversations: state.conversations,
        messages: state.messages,
        unreadMessageCount: state.conversations.reduce((acc, curr) => acc + curr.unreadCount, 0),
        // Persist NDA
        ndas: state.ndas,

        // Phase 4.8 - Subscription & Billing
        subscription: state.subscription,
        billingHistory: state.billingHistory,
        paymentMethods: state.paymentMethods,
        selectedPlanId: state.selectedPlanId,

        // Phase 4.9 - Profile & Settings
        profile: state.profile,
        settings: state.settings,
      }),
    }
  )
);
