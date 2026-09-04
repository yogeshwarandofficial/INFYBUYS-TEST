/*  */import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SellerAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(sellerId: string, periodStr: string = '30d') {
    let startDate: Date | undefined;
    const now = new Date();

    if (periodStr !== 'all') {
      startDate = new Date();
      if (periodStr === '7d') startDate.setDate(now.getDate() - 7);
      else if (periodStr === '30d') startDate.setDate(now.getDate() - 30);
      else if (periodStr === '90d') startDate.setDate(now.getDate() - 90);
      else if (periodStr === 'year') startDate.setFullYear(now.getFullYear() - 1);
      else startDate.setDate(now.getDate() - 30); // Default to 30d
    }

    const dateFilter = startDate ? { gte: startDate } : undefined;

    // 1. Active Listings
    const listings = await this.prisma.listing.findMany({
      where: { sellerId },
      include: {
        _count: {
          select: {
            views: dateFilter ? { where: { createdAt: dateFilter } } : true,
            enquiries: dateFilter ? { where: { createdAt: dateFilter } } : true,
          }
        },
      }
    });

    const activeListingsCount = listings.filter(l => l.status === 'PUBLISHED').length;
    const totalListingsCount = listings.length;

    // 2. Total Views & Enquiries for the period
    let totalViews = 0;
    let totalEnquiries = 0;

    listings.forEach(l => {
      totalViews += l._count.views;
      totalEnquiries += l._count.enquiries;
    });

    const conversionRate = totalViews > 0 ? (totalEnquiries / totalViews) * 100 : 0;

    // 3. Top Performing Listings
    const listingPerformance = listings.map(l => {
      const views = l._count.views;
      const enquiries = l._count.enquiries;
      const rate = views > 0 ? (enquiries / views) * 100 : 0;
      let performanceIndicator = 'poor';
      if (rate > 5) performanceIndicator = 'excellent';
      else if (rate > 2) performanceIndicator = 'good';
      else if (rate > 0.5) performanceIndicator = 'average';

      return {
        id: l.id,
        title: l.title,
        status: l.status,
        views,
        enquiries,
        conversionRate: rate,
        performanceIndicator,
      };
    }).sort((a, b) => b.views - a.views);

    const topListings = [...listingPerformance]
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);

    // 4. Enquiry Analytics (Include enquiries active in the period)
    const periodEnquiries = await this.prisma.enquiry.findMany({
      where: {
        sellerId,
        ...(dateFilter && { 
          OR: [
            { createdAt: dateFilter },
            { lastMessageAt: dateFilter }
          ]
        })
      },
      include: {
        _count: {
          select: { messages: true }
        },
      }
    });

    const enquiryAnalytics = {
      total: periodEnquiries.length,
      pending: periodEnquiries.filter(e => e.status === 'PENDING').length,
      inDiscussion: periodEnquiries.filter(e => e.status === 'IN_DISCUSSION' || e.status === 'SELLER_RESPONDED').length,
      nda: periodEnquiries.filter(e => e.status === 'NDA_REQUESTED' || e.status === 'NDA_SIGNED').length,
      closed: periodEnquiries.filter(e => e.status === 'CLOSED').length,
      rejected: periodEnquiries.filter(e => e.status === 'REJECTED').length,
      conversionRate: periodEnquiries.length > 0 ? (periodEnquiries.filter(e => e.status === 'CLOSED').length / periodEnquiries.length) * 100 : 0,
    };

    // 5. Message/Communication Analytics
    const conversations = periodEnquiries.filter(e => e._count.messages > 0);
    const activeConversations = conversations.filter(e => e.status !== 'CLOSED' && e.status !== 'REJECTED');
    const closedConversations = conversations.filter(e => e.status === 'CLOSED' || e.status === 'REJECTED');
    
    // Global unread metrics (independent of period filter)
    const globalUnreadMessagesCount = await this.prisma.enquiryMessage.count({
      where: {
        enquiry: { sellerId },
        senderId: { not: sellerId },
        readAt: null
      }
    });

    const globalUnreadEnquiriesCount = await this.prisma.enquiry.count({
      where: {
        sellerId,
        messages: {
          some: {
            senderId: { not: sellerId },
            readAt: null
          }
        }
      }
    });

    const messageAnalytics = {
      totalConversations: conversations.length,
      activeConversations: activeConversations.length,
      closedConversations: closedConversations.length,
      archivedConversations: 0,
      unreadMessages: globalUnreadMessagesCount,
    };

    const summary = {
      totalListings: totalListingsCount,
      activeListings: activeListingsCount,
      totalViews,
      totalEnquiries,
      unreadEnquiries: globalUnreadEnquiriesCount,
      totalConversations: conversations.length,
      unreadMessages: globalUnreadMessagesCount,
      overallConversionRate: conversionRate,
    };

    return {
      summary,
      listingPerformance,
      enquiryAnalytics,
      messageAnalytics,
      topListings,
    };
  }
}
