import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalBuyers = await this.prisma.buyerProfile.count();
    const totalSellers = await this.prisma.sellerProfile.count();
    const activeSellers = await this.prisma.sellerProfile.count({
      where: { kycStatus: 'APPROVED' }
    });
    const pendingSellers = await this.prisma.sellerProfile.count({
      where: { kycStatus: 'PENDING' }
    });

    const totalListings = await this.prisma.listing.count();
    const activeListings = await this.prisma.listing.count({
      where: { status: 'PUBLISHED' }
    });

    const totalEnquiries = await this.prisma.enquiry.count();

    // Total revenue: sum of all Payment records.
    // Returns 0 until Stripe integration is complete and real payments are recorded.
    // NOTE: Do NOT use listing.priceOrRent — that is the asking price, not received revenue.
    const paymentsAgg = await this.prisma.payment.aggregate({
      _sum: { amount: true },
    });
    const totalRevenue = paymentsAgg._sum.amount ? Number(paymentsAgg._sum.amount) : 0;

    return {
      totalUsers,
      totalBuyers,
      totalSellers,
      activeSellers,
      pendingSellers,
      totalListings,
      activeListings,
      totalEnquiries,
      totalRevenue,
    };
  }

  async getUserStats() {
    const totalUsers = await this.prisma.user.count();
    
    // We'll consider users active if they have verifiedAt set for now
    const activeUsers = await this.prisma.user.count({
      where: {
        verifiedAt: { not: null }
      }
    });

    // Sellers count based on Role
    const sellers = await this.prisma.user.count({
      where: {
        roles: {
          has: 'SELLER'
        }
      }
    });

    // Suspended users - for now 0 or based on settings
    const suspendedUsers = 0; // Update when user block logic is added to schema

    return {
      totalUsers,
      activeUsers,
      sellers,
      suspendedUsers
    };
  }

  async getUsers(query: any) {
    const { page = 1, limit = 10, search = '', role = 'all', status = 'all' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role !== 'all') {
      where.roles = {
        has: role.toUpperCase()
      };
    }

    if (status !== 'all') {
      if (status === 'active') {
        where.verifiedAt = { not: null };
      } else if (status === 'pending') {
        where.verifiedAt = null;
      }
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (query.sorting === 'oldest') orderBy = { createdAt: 'asc' };
    if (query.sorting === 'nameAsc') orderBy = { name: 'asc' };
    if (query.sorting === 'nameDesc') orderBy = { name: 'desc' };

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        sellerProfile: { select: { companyNumber: true, businessName: true } },
        buyerProfile: { select: { company: true, location: true } },
      }
    });

    const total = await this.prisma.user.count({ where });

    // Map Prisma User to AdminUser
    const mappedUsers = users.map(u => {
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.roles.includes('SELLER') ? 'seller' : u.roles.includes('BUYER') ? 'buyer' : u.roles.includes('ADMIN') ? 'admin' : 'buyer',
        status: u.verifiedAt ? 'active' : 'pending',
        company: u.sellerProfile?.businessName || u.buyerProfile?.company,
        location: u.buyerProfile?.location,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        emailVerified: !!u.verifiedAt,
        phoneVerified: false,
        listingCount: 0, // Mock for now or query
        enquiryCount: 0,
        messageCount: 0,
        activities: [],
      };
    });

    return {
      data: mappedUsers,
      total,
      page: Number(page),
      limit: Number(limit)
    };
  }

  async getAnalytics(period: string) {
    // Generate dates based on period
    const now = new Date();
    let startDate = new Date();
    let days = 30;

    switch (period) {
      case '7d': days = 7; startDate.setDate(now.getDate() - (days - 1)); break;
      case '30d': days = 30; startDate.setDate(now.getDate() - (days - 1)); break;
      case '90d': days = 90; startDate.setDate(now.getDate() - (days - 1)); break;
      case '6m': days = 180; startDate.setMonth(now.getMonth() - 6); startDate.setDate(startDate.getDate() + 1); break;
      case '1y': days = 365; startDate.setFullYear(now.getFullYear() - 1); startDate.setDate(startDate.getDate() + 1); break;
      case 'all': days = 30; startDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000); break;
      default: days = 30; startDate.setDate(now.getDate() - (days - 1)); break;
    }

    // Summary queries
    const totalUsers = await this.prisma.user.count({ where: { createdAt: { gte: startDate } } });
    const totalSellers = await this.prisma.user.count({ where: { createdAt: { gte: startDate }, roles: { has: 'SELLER' } } });
    const totalBuyers = await this.prisma.user.count({ where: { createdAt: { gte: startDate }, roles: { has: 'BUYER' } } });
    const totalListings = await this.prisma.listing.count({ where: { createdAt: { gte: startDate } } });
    const activeListings = await this.prisma.listing.count({ where: { createdAt: { gte: startDate }, status: 'PUBLISHED' } });
    const totalEnquiries = await this.prisma.enquiry.count({ where: { createdAt: { gte: startDate } } });
    
    // Fallback if message/conversation doesn't exist yet, returning 0
    const totalConversations = 0; 

    // User Growth Time Series
    // We fetch users and group in memory to avoid complex raw SQL for different DBs
    const usersInPeriod = await this.prisma.user.findMany({
      where: { createdAt: { gte: period === 'all' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : startDate } },
      select: { createdAt: true, roles: true }
    });

    const userGrowthData: any[] = [];
    const timeSeriesStart = period === 'all' ? new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) : startDate;

    for (let i = 0; i < (period === 'all' ? 30 : days); i++) {
      const d = new Date(timeSeriesStart);
      d.setDate(d.getDate() + i);
      const startOfDay = new Date(d.setHours(0,0,0,0));
      const endOfDay = new Date(d.setHours(23,59,59,999));

      const dayUsers = usersInPeriod.filter(u => u.createdAt >= startOfDay && u.createdAt <= endOfDay);
      
      userGrowthData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        buyers: dayUsers.filter(u => u.roles.includes('BUYER')).length,
        sellers: dayUsers.filter(u => u.roles.includes('SELLER')).length,
      });
    }

    // Listings by Category
    const listings = await this.prisma.listing.findMany({
      where: { createdAt: { gte: startDate } },
      select: { category: true }
    });

    const categoryCounts: Record<string, number> = {};
    listings.forEach(l => {
      const cat = l.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryColors: Record<string, string> = {
      'SaaS': '#3b82f6',
      'E-commerce': '#8b5cf6',
      'Agency': '#10b981',
      'Content': '#f59e0b',
      'Marketplace': '#06b6d4',
      'Mobile App': '#ec4899',
      'Other': '#64748b'
    };
    const fallbackColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#64748b'];

    const listingsDistribution = Object.entries(categoryCounts).map(([name, value], i) => ({
      name,
      value,
      color: categoryColors[name] || fallbackColors[i % fallbackColors.length]
    })).sort((a, b) => b.value - a.value);

    // Engagement Time Series
    const enquiriesInPeriod = await this.prisma.enquiry.findMany({
      where: { createdAt: { gte: timeSeriesStart } },
      select: { createdAt: true }
    });

    const engagementData: any[] = [];
    for (let i = 0; i < (period === 'all' ? 30 : days); i++) {
      const d = new Date(timeSeriesStart);
      d.setDate(d.getDate() + i);
      const startOfDay = new Date(d.setHours(0,0,0,0));
      const endOfDay = new Date(d.setHours(23,59,59,999));

      const dayEnquiries = enquiriesInPeriod.filter(e => e.createdAt >= startOfDay && e.createdAt <= endOfDay);

      engagementData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        enquiries: dayEnquiries.length,
        messages: 0,
      });
    }

    return {
      summary: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalListings,
        activeListings,
        totalEnquiries,
        totalConversations,
      },
      userGrowthData,
      listingsDistribution,
      engagementData
    };
  }

  async getReportData(type: string, range: string) {
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      case '6m': startDate.setMonth(now.getMonth() - 6); break;
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
      case 'all': startDate = new Date(0); break;
      default: startDate.setDate(now.getDate() - 30); break;
    }

    let data: any[] = [];
    
    switch (type) {
      case 'users':
        const users = await this.prisma.user.findMany({ where: { createdAt: { gte: startDate } } });
        data = users.map(u => ({
          ID: u.id,
          Name: u.name,
          Email: u.email,
          Role: u.roles.join(', '),
          Status: u.verifiedAt ? 'Verified' : 'Unverified',
          CreatedAt: u.createdAt.toLocaleDateString()
        }));
        break;
      case 'sellers':
        const sellers = await this.prisma.user.findMany({ 
          where: { createdAt: { gte: startDate }, roles: { has: 'SELLER' } },
          include: { _count: { select: { listings: true } }, sellerProfile: true }
        });
        data = sellers.map(s => ({
          ID: s.id,
          CompanyName: s.sellerProfile?.businessName || s.name,
          Email: s.email,
          Status: s.verifiedAt ? 'Verified' : 'Unverified',
          Type: s.sellerProfile?.sellerType || 'N/A',
          Listings: s._count.listings,
          CreatedAt: s.createdAt.toLocaleDateString()
        }));
        break;
      case 'buyers':
        const buyers = await this.prisma.user.findMany({ 
          where: { createdAt: { gte: startDate }, roles: { has: 'BUYER' } },
          include: { _count: { select: { buyerEnquiries: true } } }
        });
        data = buyers.map(b => ({
          ID: b.id,
          Name: b.name,
          Email: b.email,
          Status: b.verifiedAt ? 'Verified' : 'Unverified',
          Enquiries: b._count.buyerEnquiries,
          CreatedAt: b.createdAt.toLocaleDateString()
        }));
        break;
      case 'listings':
        const listings = await this.prisma.listing.findMany({
          where: { createdAt: { gte: startDate } },
          include: { seller: true, _count: { select: { views: true } } }
        });
        data = listings.map(l => ({
          ID: l.id,
          Title: l.title,
          Category: l.category || 'N/A',
          Price: `$${(l.priceOrRent || 0).toLocaleString()}`,
          Status: l.status,
          Seller: l.seller ? l.seller.name : 'Unknown',
          Views: l._count.views,
          CreatedAt: l.createdAt.toLocaleDateString()
        }));
        break;
      case 'enquiries':
        const enquiries = await this.prisma.enquiry.findMany({
          where: { createdAt: { gte: startDate } },
          include: { listing: true, buyer: true }
        });
        data = enquiries.map(e => ({
          ID: e.id,
          Listing: e.listing?.title || 'Unknown',
          Value: e.listing ? `$${(e.listing.priceOrRent || 0).toLocaleString()}` : 'N/A',
          Buyer: e.buyer ? e.buyer.name : 'Unknown',
          Status: e.status,
          CreatedAt: e.createdAt.toLocaleDateString()
        }));
        break;
      case 'platform':
        const totalUsers = await this.prisma.user.count({ where: { createdAt: { gte: startDate } } });
        const totalSellers = await this.prisma.user.count({ where: { createdAt: { gte: startDate }, roles: { has: 'SELLER' } } });
        const totalBuyers = await this.prisma.user.count({ where: { createdAt: { gte: startDate }, roles: { has: 'BUYER' } } });
        const totalListings = await this.prisma.listing.count({ where: { createdAt: { gte: startDate } } });
        const totalEnquiries = await this.prisma.enquiry.count({ where: { createdAt: { gte: startDate } } });
        
        data = [
          { Metric: 'Total Users', Value: totalUsers },
          { Metric: 'Total Buyers', Value: totalBuyers },
          { Metric: 'Total Sellers', Value: totalSellers },
          { Metric: 'Total Listings', Value: totalListings },
          { Metric: 'Total Enquiries', Value: totalEnquiries }
        ];
        break;
      default:
        data = [];
    }

    return data;
  }
}
