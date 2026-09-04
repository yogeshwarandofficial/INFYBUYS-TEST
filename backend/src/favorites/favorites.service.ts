import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListingsService, publicListingSelect } from '../listings/listings.service.js';
import { ListingStatus } from '../../generated/prisma/client.js';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingsService: ListingsService
  ) {}

  async addFavorite(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const publicStatuses = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (!publicStatuses.includes(listing.status as any)) {
      throw new ConflictException('Listing is not available to be favorited');
    }

    await this.prisma.favorite.upsert({
      where: {
        buyerId_listingId: {
          buyerId,
          listingId,
        }
      },
      update: {},
      create: {
        buyerId,
        listingId,
      }
    });

    return { success: true, favorited: true };
  }

  async removeFavorite(buyerId: string, listingId: string) {
    try {
      await this.prisma.favorite.delete({
        where: {
          buyerId_listingId: {
            buyerId,
            listingId,
          }
        }
      });
    } catch (e) {
      // If it doesn't exist, ignore the error
    }

    return { success: true, favorited: false };
  }

  async getBuyerFavorites(buyerId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { buyerId },
      include: {
        listing: {
          select: publicListingSelect
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const publicStatuses = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    
    // Filter out unavailable listings and format the response
    const validFavorites = favorites.filter(f => f.listing && publicStatuses.includes(f.listing.status as any));
    
    const enrichedListings = await Promise.all(
      validFavorites.map(async f => {
        // Use ListingsService to enrich the listing (resolve S3 URLs etc)
        const enrichedListing = await this.listingsService.enrichAndSanitizeListing(f.listing as any);
        return {
          favoriteCreatedAt: f.createdAt,
          listing: enrichedListing,
        };
      })
    );

    return enrichedListings;
  }
}
