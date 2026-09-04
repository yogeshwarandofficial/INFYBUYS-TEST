import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NdaStatus } from '../../generated/prisma/client.js';

@Injectable()
export class NdaService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  /**
   * Internal helper to check if a buyer has signed the NDA for a listing.
   * Can be used by other services (e.g. ListingsService).
   */
  async hasBuyerSignedNda(buyerId: string, listingId: string): Promise<boolean> {
    const agreement = await this.prisma.ndaAgreement.findUnique({
      where: {
        listingId_buyerId: { listingId, buyerId }
      }
    });
    return agreement?.status === NdaStatus.SIGNED;
  }

  async requestNda(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    
    if (!listing.ndaRequired) {
      throw new ConflictException('This listing does not require an NDA');
    }

    if (listing.sellerId === buyerId) {
      throw new ForbiddenException('You cannot request an NDA for your own listing');
    }

    const existing = await this.prisma.ndaAgreement.findUnique({
      where: {
        listingId_buyerId: { listingId, buyerId }
      }
    });

    if (existing) {
      return existing; // Idempotent response
    }

    const agreement = await this.prisma.ndaAgreement.create({
      data: {
        listingId,
        buyerId,
        status: NdaStatus.REQUESTED,
        ndaVersion: "1.0", // Current server active NDA version
      }
    });

    const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });

    await this.notificationsService.createNotification({
      userId: listing.sellerId,
      type: 'NDA_REQUESTED',
      title: 'New NDA Request',
      message: `${buyer?.name || 'A buyer'} has requested to sign the NDA for your listing "${listing.title}".`,
      link: `/seller/enquiries` // or seller/nda if there is a dedicated page
    });

    return agreement;
  }

  async signNda(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.ndaRequired) {
      throw new ConflictException('This listing does not require an NDA');
    }

    const existing = await this.prisma.ndaAgreement.findUnique({
      where: {
        listingId_buyerId: { listingId, buyerId }
      }
    });

    if (!existing) {
      throw new ConflictException('You must request an NDA before signing it');
    }

    if (existing.status === NdaStatus.SIGNED) {
      return existing; // Idempotent
    }

    const signedAgreement = await this.prisma.ndaAgreement.update({
      where: {
        listingId_buyerId: { listingId, buyerId }
      },
      data: {
        status: NdaStatus.SIGNED,
        signedAt: new Date(),
        ndaVersion: "1.0", // Record the version they signed against
      }
    });

    const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });

    await this.notificationsService.createNotification({
      userId: listing.sellerId,
      type: 'NDA_SIGNED',
      title: 'NDA Signed',
      message: `${buyer?.name || 'A buyer'} has signed the NDA for your listing "${listing.title}".`,
      link: `/seller/enquiries`
    });

    return signedAgreement;
  }

  async getNdaStatusForBuyer(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.ndaRequired) {
      return { ndaRequired: false, agreement: null };
    }

    const agreement = await this.prisma.ndaAgreement.findUnique({
      where: {
        listingId_buyerId: { listingId, buyerId }
      }
    });

    return {
      ndaRequired: true,
      agreement
    };
  }

  async getAllNdasForBuyer(buyerId: string) {
    return this.prisma.ndaAgreement.findMany({
      where: { buyerId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            seller: {
              select: {
                sellerProfile: {
                  select: {
                    businessName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  async getAllNdasForSeller(sellerId: string) {
    return this.prisma.ndaAgreement.findMany({
      where: {
        listing: {
          sellerId
        }
      },
      include: {
        listing: {
          select: { id: true, title: true }
        },
        buyer: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }
}
