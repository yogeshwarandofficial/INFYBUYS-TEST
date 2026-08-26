// Removed mock data imports
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/apiClient';

export type AdminPlatformSettings = {
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  timezone: string;

  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  allowSellerRegistrations: boolean;
  allowBuyerRegistrations: boolean;

  requireSellerApproval: boolean;
  requireListingApproval: boolean;
  requireReviewModeration: boolean;

  enableNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;

  maxListingImages: number;
  maxMessageLength: number;

  updatedAt: string;
};

export type AdminAuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'hide'
  | 'archive'
  | 'close'
  | 'login'
  | 'logout'
  | 'export'
  | 'settings_update'
  | 'status_change'
  | 'message_sent'
  | 'notification_sent';

export type AdminAuditEntityType =
  | 'user'
  | 'seller'
  | 'buyer'
  | 'listing'
  | 'enquiry'
  | 'conversation'
  | 'review'
  | 'notification'
  | 'settings'
  | 'report';

export interface AdminAuditLog {
  id: string;
  action: AdminAuditAction;
  entityType: AdminAuditEntityType;
  entityId?: string;
  entityLabel?: string;
  performedBy: string;
  performedById: string;
  description: string;
  metadata?: Record<string, string>;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalEnquiries: number;
  totalRevenue: number;
  unreadMessages: number;
  pendingApprovals: number;
}

export interface AdminRecentActivity {
  id: string;
  type: 'user_registered' | 'seller_registered' | 'listing_submitted' | 'listing_approved' | 'enquiry_received' | 'account_updated';
  description: string;
  createdAt: string;
  read: boolean;
}

export interface AdminSystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  createdAt: string;
}

export type AdminUserRole = 'buyer' | 'seller' | 'admin';
export type AdminUserStatus = 'active' | 'suspended' | 'pending' | 'blocked';

export interface AdminUserActivity {
  id: string;
  action: string;
  date: string;
  details?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  avatar?: string;
  company?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  listingCount: number;
  enquiryCount: number;
  messageCount: number;
  activities: AdminUserActivity[];
}

export type AdminSellerStatus = 'pending' | 'active' | 'suspended' | 'blocked' | 'rejected';

export interface AdminSellerActivity {
  id: string;
  action: string;
  date: string;
  details?: string;
}

export interface AdminSeller {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  avatar?: string;
  location?: string;
  sellerType: string;
  experience?: string;
  status: AdminSellerStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  businessVerified: boolean;
  profileCompleted: boolean;
  listingCount: number;
  activeListingCount: number;
  pendingListingCount: number;
  soldListingCount: number;
  enquiryCount: number;
  unreadMessageCount: number;
  totalViews: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  activities: AdminSellerActivity[];
}

export type AdminBuyerStatus = 'active' | 'suspended' | 'blocked' | 'pending' | 'deleted';
export type AdminBuyerVerificationStatus = 'verified' | 'pending' | 'unverified';

export interface AdminBuyerActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminBuyer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  avatar?: string;
  status: AdminBuyerStatus;
  verificationStatus: AdminBuyerVerificationStatus;
  joinedAt: string;
  lastActiveAt?: string;
  totalEnquiries: number;
  totalMessages: number;
  totalNdaRequests: number;
  totalPurchases: number;
  activities: AdminBuyerActivity[];
  createdAt: string;
  updatedAt: string;
}

export type AdminListingStatus = 'pending' | 'active' | 'suspended' | 'rejected' | 'draft' | 'sold' | 'closed' | 'DRAFT' | 'SUBMITTED_FOR_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'PAUSED' | 'SOLD_LET' | 'EXPIRED';

export interface AdminListingActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerCompany?: string;
  status: AdminListingStatus;
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  enquiries: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  images: string[];
  activities: AdminListingActivity[];
}

export type AdminEnquiryStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'closed' | 'rejected';

export interface AdminEnquiryActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminEnquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  listingValue: number;
  currency: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  sellerId: string;
  sellerName: string;
  status: AdminEnquiryStatus;
  message: string;
  hasNda: boolean;
  ndaStatus?: 'pending' | 'signed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  activities: AdminEnquiryActivity[];
}

export type AdminConversationStatus = 'active' | 'archived' | 'closed';

export interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface AdminConversation {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: AdminConversationStatus;
  createdAt: string;
  updatedAt: string;
  messages: AdminMessage[];
}

export type AdminNotificationType =
  | 'system'
  | 'user'
  | 'seller'
  | 'buyer'
  | 'listing'
  | 'enquiry'
  | 'message'
  | 'security'
  | 'announcement';

export type AdminReviewStatus = 'pending' | 'published' | 'hidden' | 'rejected' | 'flagged' | 'deleted';

export interface AdminReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  targetId: string;
  targetName: string;
  targetType: 'seller' | 'listing';
  rating: number;
  title: string;
  comment: string;
  status: AdminReviewStatus;
  adminReply?: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  relatedId?: string;
  createdAt: string;
}

interface AdminState {
  stats: AdminDashboardStats;
  recentActivity: AdminRecentActivity[];
  systemAlerts: AdminSystemAlert[];
  users: AdminUser[];
  sellers: AdminSeller[];
  buyers: AdminBuyer[];
  listings: AdminListing[];
  enquiries: AdminEnquiry[];
  conversations: AdminConversation[];
  notifications: AdminNotification[];
  reviews: AdminReview[];
  settings: AdminPlatformSettings;
  auditLogs: AdminAuditLog[];

  // Audit Log Actions
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'createdAt'>) => void;
  deleteAuditLog: (id: string) => void;
  fetchPlatformData: () => Promise<void>;
  clearAuditLogs: () => void;

  // Existing Actions
  markActivityRead: (id: string) => void;
  dismissSystemAlert: (id: string) => void;

  // User Actions
  updateUserStatus: (id: string, status: AdminUserStatus) => void;
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;
  blockUser: (id: string) => void;
  updateUserRole: (id: string, role: AdminUserRole) => void;
  deleteUser: (id: string) => void;
  addUserActivity: (id: string, activity: Omit<AdminUserActivity, 'id'>) => void;

  // Seller Actions
  approveSeller: (id: string) => void;
  rejectSeller: (id: string) => void;
  suspendSeller: (id: string) => void;
  activateSeller: (id: string) => void;
  blockSeller: (id: string) => void;
  unblockSeller: (id: string) => void;
  deleteSeller: (id: string) => void;
  addSellerActivity: (id: string, activity: Omit<AdminSellerActivity, 'id'>) => void;

  // Buyer Actions
  activateBuyer: (id: string) => void;
  suspendBuyer: (id: string) => void;
  blockBuyer: (id: string) => void;
  unblockBuyer: (id: string) => void;
  restoreBuyer: (id: string) => void;
  deleteBuyer: (id: string) => void;
  verifyBuyer: (id: string) => void;
  unverifyBuyer: (id: string) => void;
  addBuyerActivity: (id: string, activity: Omit<AdminBuyerActivity, 'id'>) => void;

  // Listing Actions
  approveListing: (id: string) => void;
  rejectListing: (id: string) => void;
  suspendListing: (id: string) => void;
  restoreListing: (id: string) => void;
  verifyListing: (id: string) => void;
  unverifyListing: (id: string) => void;
  markListingSold: (id: string) => void;
  closeListing: (id: string) => void;
  reopenListing: (id: string) => void;
  deleteListing: (id: string) => void;
  addListingActivity: (id: string, activity: Omit<AdminListingActivity, 'id'>) => void;

  // Enquiry Actions
  updateEnquiryStatus: (id: string, status: AdminEnquiryStatus) => void;
  deleteEnquiry: (id: string) => void;
  addEnquiryActivity: (id: string, activity: Omit<AdminEnquiryActivity, 'id'>) => void;

  // Conversation Actions
  updateConversationStatus: (id: string, status: AdminConversationStatus) => void;
  addAdminMessage: (conversationId: string, content: string) => void;
  deleteConversation: (id: string) => void;

  // Notification Actions
  markAdminNotificationRead: (id: string) => void;
  markAllAdminNotificationsRead: () => void;
  deleteAdminNotification: (id: string) => void;
  createAdminNotification: (notification: Omit<AdminNotification, 'id' | 'isRead' | 'createdAt'>) => void;

  // Review Actions
  updateAdminReviewStatus: (id: string, status: AdminReviewStatus) => void;
  deleteAdminReview: (id: string) => void;
  replyToAdminReview: (id: string, reply: string) => void;
  // Settings Actions
  updateSettings: (settings: Partial<AdminPlatformSettings>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);



export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [];

export const MOCK_SETTINGS: AdminPlatformSettings = {
  platformName: 'InfyBuys',
  platformDescription: 'The premier marketplace for buying and selling online businesses and assets.',
  supportEmail: 'support@infybuys.com',
  supportPhone: '+1 (555) 123-4567',
  defaultCurrency: 'USD',
  timezone: 'UTC',

  maintenanceMode: false,
  allowNewRegistrations: true,
  allowSellerRegistrations: true,
  allowBuyerRegistrations: true,

  requireSellerApproval: true,
  requireListingApproval: true,
  requireReviewModeration: false,

  enableNotifications: true,
  enableEmailNotifications: true,
  enableSmsNotifications: false,

  maxListingImages: 10,
  maxMessageLength: 2000,

  updatedAt: new Date().toISOString(),
};

export const MOCK_CONVERSATIONS: AdminConversation[] = [];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      stats: {
        totalUsers: 14520,
        totalBuyers: 12100,
        totalSellers: 2420,
        totalListings: 8540,
        activeListings: 7120,
        pendingListings: 430,
        totalEnquiries: 12500,
        totalRevenue: 245000,
        unreadMessages: 15,
        pendingApprovals: 430,
      },
      recentActivity: [
        {
          id: 'act_1',
          type: 'seller_registered',
          description: 'New seller "TechCorp Solutions" registered.',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          read: false,
        },
        {
          id: 'act_2',
          type: 'listing_submitted',
          description: 'Listing "Premium Office Chairs" submitted for review.',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          read: false,
        },
        {
          id: 'act_3',
          type: 'listing_approved',
          description: 'Listing "MacBook Pro 16" was approved by Auto-mod.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          read: true,
        },
      ],
      systemAlerts: [
        {
          id: 'alt_1',
          severity: 'warning',
          message: 'High volume of pending listing approvals detected.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        }
      ],
      users: [],
      sellers: [],
      buyers: [],
      listings: [],
      enquiries: [],
      conversations: [],
      notifications: [],
      reviews: [],
      settings: MOCK_SETTINGS,
      auditLogs: MOCK_AUDIT_LOGS,

      markActivityRead: (id) =>
        set((state) => ({
          recentActivity: state.recentActivity.map((activity) =>
            activity.id === id ? { ...activity, read: true } : activity
          ),
        })),

      dismissSystemAlert: (id) =>
        set((state) => ({
          systemAlerts: state.systemAlerts.filter((alert) => alert.id !== id),
        })),

      updateUserStatus: (id, status) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status, updatedAt: new Date().toISOString() }
              : user
          )
        })),

      suspendUser: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status: 'suspended', updatedAt: new Date().toISOString() }
              : user
          )
        })),

      activateUser: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status: 'active', updatedAt: new Date().toISOString() }
              : user
          )
        })),

      blockUser: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status: 'blocked', updatedAt: new Date().toISOString() }
              : user
          )
        })),

      updateUserRole: (id, role) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, role, updatedAt: new Date().toISOString() }
              : user
          )
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
        })),

      addUserActivity: (id, activity) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  activities: [
                    { ...activity, id: `act_${generateId()}` },
                    ...user.activities
                  ],
                  updatedAt: new Date().toISOString()
                }
              : user
          )
        })),

      approveSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'active', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      rejectSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'rejected', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      suspendSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'suspended', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      activateSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'active', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      blockSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'blocked', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      unblockSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? { ...seller, status: 'active', updatedAt: new Date().toISOString() }
              : seller
          )
        })),

      deleteSeller: (id) =>
        set((state) => ({
          sellers: state.sellers.filter((seller) => seller.id !== id)
        })),

      addSellerActivity: (id, activity) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === id
              ? {
                  ...seller,
                  activities: [
                    { ...activity, id: `act_${generateId()}` },
                    ...seller.activities
                  ],
                  updatedAt: new Date().toISOString()
                }
              : seller
          )
        })),

      activateBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'active', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      suspendBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'suspended', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      blockBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'blocked', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      unblockBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'active', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      restoreBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'pending', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      deleteBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, status: 'deleted', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      verifyBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, verificationStatus: 'verified', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      unverifyBuyer: (id) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id ? { ...buyer, verificationStatus: 'unverified', updatedAt: new Date().toISOString() } : buyer
          )
        })),

      addBuyerActivity: (id, activity) =>
        set((state) => ({
          buyers: state.buyers.map((buyer) =>
            buyer.id === id
              ? {
                  ...buyer,
                  activities: [
                    { ...activity, id: `b_act_${generateId()}` },
                    ...buyer.activities
                  ],
                  updatedAt: new Date().toISOString()
                }
              : buyer
          )
        })),

      approveListing: async (id) => {
        try {
          await apiClient.post(`/listings/${id}/approve`, {});
          set((state) => ({
            listings: state.listings.map((listing) =>
              listing.id === id ? { ...listing, status: 'PUBLISHED', publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any : listing
            )
          }));
        } catch (e) {
          console.error(e);
        }
      },

      rejectListing: async (id) => {
        try {
          await apiClient.post(`/listings/${id}/reject`, { reason: 'Rejected by admin' });
          set((state) => ({
            listings: state.listings.map((listing) =>
              listing.id === id ? { ...listing, status: 'REJECTED', updatedAt: new Date().toISOString() } as any : listing
            )
          }));
        } catch (e) {
          console.error(e);
        }
      },

      suspendListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, status: 'suspended', updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      restoreListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, status: 'pending', updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      verifyListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, isVerified: true, updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      unverifyListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, isVerified: false, updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      markListingSold: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, status: 'sold', updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      closeListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, status: 'closed', updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      reopenListing: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id ? { ...listing, status: 'active', updatedAt: new Date().toISOString() } as any : listing
          )
        })),

      deleteListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((listing) => listing.id !== id)
        })),

      addListingActivity: (id, activity) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id
              ? {
                  ...listing,
                  activities: [
                    { ...activity, id: `l_act_${generateId()}` },
                    ...(listing as any).activities || []
                  ],
                  updatedAt: new Date().toISOString()
                } as any
              : listing
          )
        })),

      updateEnquiryStatus: (id, status) =>
        set((state) => ({
          enquiries: state.enquiries.map((enquiry) =>
            enquiry.id === id ? { ...enquiry, status, updatedAt: new Date().toISOString() } : enquiry
          )
        })),

      deleteEnquiry: (id) =>
        set((state) => ({
          enquiries: state.enquiries.filter((enquiry) => enquiry.id !== id)
        })),

      addEnquiryActivity: (id, activity) =>
        set((state) => ({
          enquiries: state.enquiries.map((enquiry) =>
            enquiry.id === id
              ? {
                  ...enquiry,
                  activities: [
                    { ...activity, id: `e_act_${generateId()}` },
                    ...enquiry.activities
                  ],
                  updatedAt: new Date().toISOString()
                }
              : enquiry
          )
        })),

      updateConversationStatus: (id, status) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, status, updatedAt: new Date().toISOString() } : conv
          )
        })),

      addAdminMessage: (conversationId, content) =>
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const newMessage: AdminMessage = {
                id: `msg_${generateId()}`,
                senderId: 'admin_1',
                senderName: 'InfyBuys Admin',
                senderRole: 'admin',
                content,
                timestamp: new Date().toISOString(),
                isRead: true
              };
              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date().toISOString()
              };
            }
            return conv;
          })
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id)
        })),

      markAdminNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        })),

      markAllAdminNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, isRead: true }))
        })),

      deleteAdminNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id)
        })),

      createAdminNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif_${generateId()}`,
              isRead: false,
              createdAt: new Date().toISOString()
            },
            ...state.notifications
          ]
        })),

      updateAdminReviewStatus: (id, status) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status } : r
          )
        })),

      deleteAdminReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status: 'deleted' } : r
          )
        })),

      replyToAdminReview: (id, reply) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, adminReply: reply } : r
          )
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            updatedAt: new Date().toISOString(),
          }
        })),

      addAuditLog: (log) =>
        set((state) => ({
          auditLogs: [
            {
              ...log,
              id: `audit_${generateId()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.auditLogs,
          ]
        })),

      deleteAuditLog: (id) =>
        set((state) => ({
          auditLogs: state.auditLogs.filter((log) => log.id !== id)
        })),

      clearAuditLogs: () =>
        set(() => ({ auditLogs: [] })),
      fetchPlatformData: async () => {
        try {
          // const users = await apiClient.get<any[]>('/users');
          // For now just fetch listings correctly
          const res = await apiClient.get<{data: any[], total: number}>('/listings/admin/search');
          // const enquiries = await apiClient.get<any[]>('/enquiries');
          // const conversations = await apiClient.get<any[]>('/conversations');
          set((state: any) => ({
            listings: res.data ? res.data.map((l: any) => ({
              ...l,
              price: l.priceOrRent || 0,
              currency: l.currency || 'USD',
              sellerName: l.sellerName || 'Unknown Seller',
              images: l.media ? l.media.map((m: any) => m.url) : [],
              views: l.views || 0,
              enquiries: l.enquiries || 0,
              activities: l.activities || [],
              createdAt: l.createdAt || new Date().toISOString(),
              updatedAt: l.updatedAt || new Date().toISOString()
            })) : state.listings
          }));
        } catch (e) {
          console.error(e);
        }
      },
    }),
    {
      name: 'infybuys-admin-storage',
      partialize: (state) => ({
        stats: state.stats,
        recentActivity: state.recentActivity,
        systemAlerts: state.systemAlerts,
        users: state.users,
        sellers: state.sellers,
        buyers: state.buyers,
        listings: state.listings,
        enquiries: state.enquiries,
        conversations: state.conversations,
        notifications: state.notifications,
        reviews: state.reviews,
        settings: state.settings,
        auditLogs: state.auditLogs,
      }),
    }
  )
);
