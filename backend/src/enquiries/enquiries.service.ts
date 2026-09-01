import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async createEnquiry(listingId: string, buyerId: string, dto: CreateEnquiryDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'PUBLISHED') {
      throw new BadRequestException('Listing is not available for enquiries');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException('You cannot enquire on your own listing');
    }

    // Check subscription
    const activeSub = await this.prisma.userSubscription.findFirst({
      where: {
        userId: buyerId,
        status: 'ACTIVE',
      },
    });

    if (!activeSub) {
      throw new ForbiddenException({ message: 'Subscription required', code: 'SUBSCRIPTION_REQUIRED' });
    }

    // Check NDA
    if (listing.ndaRequired) {
      const nda = await this.prisma.listingNdaAcceptance.findUnique({
        where: {
          listingId_buyerId: {
            listingId,
            buyerId,
          },
        },
      });

      if (!nda) {
        throw new ForbiddenException({ message: 'NDA acceptance required', code: 'NDA_REQUIRED' });
      }
    }

    // Check if enquiry already exists
    let enquiry = await this.prisma.enquiry.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        },
      },
      include: {
        messages: true,
      }
    });

    if (!enquiry) {
      enquiry = await this.prisma.enquiry.create({
        data: {
          listingId,
          buyerId,
          sellerId: listing.sellerId,
          messages: {
            create: {
              senderId: buyerId,
              messageText: dto.messageText.trim(),
            },
          },
        },
        include: {
          messages: true,
        }
      });
    }

    return enquiry;
  }

  async getBuyerEnquiries(buyerId: string) {
    const enquiries = await this.prisma.enquiry.findMany({
      where: { buyerId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            coverMediaId: true,
            locationArea: true,
            priceOrRent: true,
            status: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                readAt: null,
                NOT: { senderId: buyerId },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return enquiries.map(eq => ({
      id: eq.id,
      listing: eq.listing,
      seller: eq.seller,
      lastMessage: eq.messages[0],
      unreadCount: eq._count.messages,
      updatedAt: eq.updatedAt,
    }));
  }

  async getSellerEnquiries(sellerId: string) {
    const enquiries = await this.prisma.enquiry.findMany({
      where: { sellerId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            coverMediaId: true,
            locationArea: true,
            priceOrRent: true,
            status: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                readAt: null,
                NOT: { senderId: sellerId },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return enquiries.map(eq => ({
      id: eq.id,
      listing: eq.listing,
      buyer: eq.buyer,
      lastMessage: eq.messages[0],
      unreadCount: eq._count.messages,
      updatedAt: eq.updatedAt,
    }));
  }

  async getEnquiry(enquiryId: string, userId: string) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            coverMediaId: true,
            locationArea: true,
            priceOrRent: true,
            status: true,
          }
        },
        buyer: {
          select: { id: true, name: true }
        },
        seller: {
          select: { id: true, name: true }
        },
        messages: {
          orderBy: { sentAt: 'asc' },
        },
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (enquiry.buyerId !== userId && enquiry.sellerId !== userId) {
      throw new ForbiddenException('You are not a participant in this enquiry');
    }

    return enquiry;
  }

  async sendMessage(enquiryId: string, userId: string, dto: SendMessageDto) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id: enquiryId },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (enquiry.buyerId !== userId && enquiry.sellerId !== userId) {
      throw new ForbiddenException('You are not a participant in this enquiry');
    }

    const message = await this.prisma.enquiryMessage.create({
      data: {
        enquiryId,
        senderId: userId,
        messageText: dto.messageText.trim(),
      },
    });

    await this.prisma.enquiry.update({
      where: { id: enquiryId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markRead(enquiryId: string, userId: string) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id: enquiryId },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (enquiry.buyerId !== userId && enquiry.sellerId !== userId) {
      throw new ForbiddenException('You are not a participant in this enquiry');
    }

    await this.prisma.enquiryMessage.updateMany({
      where: {
        enquiryId,
        readAt: null,
        NOT: { senderId: userId },
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true };
  }
}
