export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  message: string;
  code: string;
  details?: Record<string, string[]>; // Field-specific validation errors
}

// Standardized query parameters for pagination/filtering
export interface ApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  isFeatured?: boolean;
}

export interface ListingMedia {
  id: string;
  type: 'PHOTO' | 'VIDEO' | string;
  url: string;
  order?: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  type: string;
  category: string;
  title: string;
  description: string;
  priceOrRent: number;
  currency: string;
  locationArea: string;
  locationPostcode: string;
  locationExact?: string;
  turnover?: number;
  netProfit?: number;
  establishedYear?: number;
  status: string;
  ndaRequired: boolean;
  isFeatured?: boolean; // Keep for frontend UI
  isPremium?: boolean; // Keep for frontend UI
  tags?: string[]; // Keep for frontend UI
  seller?: {
    id: string;
    name: string;
    verified: boolean;
    memberSince?: string;
    rating?: number;
    completedDeals?: number;
    sellerProfile?: {
      businessName?: string;
      avatarKey?: string;
      sellerType?: string;
      location?: string;
    };
  };
  images?: string[];
  media?: ListingMedia[];
  coverMediaId?: string;
}

export interface EnquiryMessage {
  id: string;
  enquiryId: string;
  senderId: string;
  messageText: string;
  sentAt: string;
  readAt: string | null;
}

export interface Enquiry {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    coverMediaId: string | null;
    locationArea: string;
    priceOrRent: number;
    status: string;
  };
  buyer?: {
    id: string;
    name: string;
  };
  seller?: {
    id: string;
    name: string;
  };
  lastMessage?: EnquiryMessage;
  unreadCount?: number;
  messages?: EnquiryMessage[];
  status?: string;
  lastMessageAt?: string;
}
