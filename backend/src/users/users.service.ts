import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userSubscriptions: {
          where: { status: 'ACTIVE' }
        }
      }
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateSettings(id: string, settings: any): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const currentSettings = user.settings && typeof user.settings === 'object' ? user.settings : {};
    const newSettings = { ...currentSettings, ...settings };

    return this.prisma.user.update({
      where: { id },
      data: { settings: newSettings },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Delete Enquiries and Messages
      await tx.enquiryMessage.deleteMany({ where: { senderId: id } });
      await tx.enquiry.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });

      // Delete NDAs
      await tx.ndaAgreement.deleteMany({ where: { buyerId: id } });

      // Delete Listings and associated records
      const userListings = await tx.listing.findMany({ where: { sellerId: id }, select: { id: true } });
      const listingIds = userListings.map(l => l.id);
      
      if (listingIds.length > 0) {
        await tx.listingMedia.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.listingRevision.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.favorite.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.listingView.deleteMany({ where: { listingId: { in: listingIds } } });
        await tx.listing.deleteMany({ where: { sellerId: id } });
      }
      await tx.listingRevision.deleteMany({ where: { createdBy: id } });

      // Delete Reviews
      await tx.review.deleteMany({ where: { OR: [{ buyerId: id }, { sellerId: id }] } });

      // Delete Payments & Subscriptions
      await tx.payment.deleteMany({ where: { userId: id } });
      await tx.userSubscription.deleteMany({ where: { userId: id } });

      // Delete Admin Logs
      await tx.adminActionLog.deleteMany({ where: { adminId: id } });

      // Delete Notifications (if explicit relation exists or just records)
      await tx.notification.deleteMany({ where: { userId: id } });

      // Delete the User (Cascades: Profiles, RefreshTokens, Favorites, SavedSearches)
      await tx.user.delete({ where: { id } });
    });
  }
}
