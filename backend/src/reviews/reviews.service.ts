import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async createReview(data: {
    listingId?: string;
    sellerId?: string;
    buyerId: string;
    rating: number;
    comment?: string;
  }) {
    const review = await this.prisma.review.create({
      data,
      include: {
        buyer: {
          select: { name: true, buyerProfile: { select: { avatarKey: true, company: true } } }
        },
        listing: {
          select: { title: true }
        }
      }
    });

    if (data.sellerId) {
      const listingTitle = review.listing?.title ? ` for ${review.listing.title}` : '';
      await this.notificationsService.createNotification({
        userId: data.sellerId,
        type: NotificationType.NEW_MESSAGE,
        title: 'New Review Received',
        message: `${review.buyer?.name || 'A buyer'} left a ${data.rating}-star review${listingTitle}.`,
        link: `/seller/profile`, // Or wherever seller sees their reviews
      });
    }

    return review;
  }

  async getReviewsForListing(listingId: string) {
    return this.prisma.review.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: { name: true, buyerProfile: { select: { avatarKey: true, company: true } } }
        }
      }
    });
  }

  async getReviewsForSeller(sellerId: string) {
    return this.prisma.review.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: { name: true, buyerProfile: { select: { avatarKey: true, company: true } } }
        }
      }
    });
  }
}
