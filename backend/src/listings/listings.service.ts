import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingQueryDto } from './dto/listing-query.dto.js';
import { AddListingMediaDto } from './dto/add-listing-media.dto.js';
import { ReorderListingMediaDto } from './dto/reorder-listing-media.dto.js';
import { RejectListingDto } from '../admin/dto/reject-listing.dto.js';
import { ListingStatus, MediaType, Role } from '../../generated/prisma/client.js';
import * as crypto from 'crypto';
import * as path from 'path';

const publicListingSelect = {
  id: true,
  sellerId: true,
  type: true,
  category: true,
  title: true,
  description: true,
  priceOrRent: true,
  currency: true,
  locationArea: true,
  locationPostcode: true,
  locationExact: true,
  turnover: true,
  netProfit: true,
  establishedYear: true,
  status: true,
  rejectionReasonCode: true,
  ndaRequired: true,
  createdAt: true,
  updatedAt: true,
  expiresAt: true,
  media: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  coverMediaId: true,
};

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async create(sellerId: string, createListingDto: CreateListingDto) {
    const listing = await this.prisma.listing.create({
      data: {
        ...createListingDto,
        sellerId,
        status: ListingStatus.DRAFT,
      },
      include: {
        media: true,
      }
    });

    return await this.enrichAndSanitizeListing(listing, { id: sellerId });
  }

  async findOne(id: string, user?: any) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      select: {
        ...publicListingSelect,
        seller: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (!publicStatuses.includes(listing.status)) {
      const isOwner = user && user.id === listing.sellerId;
      const isAdmin = user && user.roles?.includes(Role.ADMIN);
      
      if (!isOwner && !isAdmin) {
        throw new NotFoundException('Listing not found');
      }
    }

    // Do NOT expose private data. Just return the listing fields.
    // If we wanted to check if it's published and public user vs seller etc.,
    // we would handle that either here or in the controller based on user role.
    return await this.enrichAndSanitizeListing(listing, user);
  }

  async findSellerListings(sellerId: string) {
    const listings = await this.prisma.listing.findMany({
      where: { sellerId },
      include: {
        media: true,
      }
    });

    return await Promise.all(listings.map(l => this.enrichAndSanitizeListing(l, { id: sellerId })));
  }

  async update(sellerId: string, id: string, updateListingDto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to update this listing');
    }

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (publicStatuses.includes(listing.status)) {
      // Create or update a pending revision instead of touching the live listing
      let revision = await this.prisma.listingRevision.findFirst({
        where: { listingId: id, status: { in: ['PENDING', 'REJECTED'] } }
      });

      // proposedData starts as empty or existing proposedData
      let proposedData = revision && revision.proposedData && typeof revision.proposedData === 'object' ? revision.proposedData : {};
      proposedData = { ...(proposedData as any), ...updateListingDto };

      if (revision) {
        await this.prisma.listingRevision.update({
          where: { id: revision.id },
          data: {
            status: 'PENDING',
            proposedData,
          }
        });
      } else {
        await this.prisma.listingRevision.create({
          data: {
            listingId: id,
            createdBy: sellerId,
            status: 'PENDING',
            proposedData,
          }
        });
      }

      const updatedListing = await this.prisma.listing.update({
        where: { id },
        data: { status: ListingStatus.CHANGES_PENDING_REVIEW },
        include: { media: true }
      });
      return await this.enrichAndSanitizeListing(updatedListing, { id: sellerId });
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
      include: {
        media: true,
      }
    });

    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async submitForReview(sellerId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to submit this listing');
    }

    if (listing.status !== ListingStatus.DRAFT) {
      throw new ConflictException('Only DRAFT listings can be submitted for review');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.SUBMITTED_FOR_REVIEW },
      include: { media: true }
    });

    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async approveListing(adminId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId }, include: { seller: true } });
    
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.status !== ListingStatus.SUBMITTED_FOR_REVIEW) {
      throw new ConflictException('Only listings SUBMITTED_FOR_REVIEW can be approved');
    }

    const roles = listing.seller.roles || [];
    const newRoles = roles.includes('SELLER' as any) ? roles : [...roles, 'SELLER' as any];

    const [updated] = await this.prisma.$transaction([
      this.prisma.listing.update({
        where: { id: listingId },
        data: {
          status: ListingStatus.PUBLISHED,
          rejectionReasonCode: null,
        },
        include: { media: true }
      }),
      this.prisma.user.update({
        where: { id: listing.sellerId },
        data: {
          roles: { set: newRoles }
        }
      }),
      this.prisma.adminActionLog.create({
        data: {
          adminId,
          actionType: 'LISTING_APPROVED',
          targetEntity: `Listing:${listingId}`,
        }
      })
    ]);

    return await this.enrichAndSanitizeListing(updated);
  }

  async rejectListing(adminId: string, listingId: string, dto: RejectListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.status !== ListingStatus.SUBMITTED_FOR_REVIEW) {
      throw new ConflictException('Only listings SUBMITTED_FOR_REVIEW can be rejected');
    }

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.REJECTED,
        rejectionReasonCode: dto.rejectionReasonCode,
      },
      include: { media: true }
    });

    await this.prisma.adminActionLog.create({
      data: {
        adminId,
        actionType: 'LISTING_REJECTED',
        targetEntity: `Listing:${listingId}`,
        reason: dto.rejectionReasonCode,
      }
    });

    return await this.enrichAndSanitizeListing(updated);
  }

  async search(query: ListingQueryDto, options?: { isAdmin?: boolean }) {
    const {
      type,
      category,
      locationArea,
      locationPostcode,
      minPrice,
      maxPrice,
      minTurnover,
      maxTurnover,
      minNetProfit,
      maxNetProfit,
      status,
      page = 1,
      limit = 20,
    } = query || {};

    // Base query: ONLY published listings for normal search unless explicitly filtered (which we'll restrict if not admin/seller)
    const where: any = {};
    if (options?.isAdmin) {
      if (status) {
        where.status = status;
      }
    } else {
      where.status = { in: [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES] };
    }

    if (type) where.type = type;
    if (category) where.category = category;
    if (locationArea) where.locationArea = { contains: locationArea, mode: 'insensitive' };
    if (locationPostcode) where.locationPostcode = { contains: locationPostcode, mode: 'insensitive' };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceOrRent = {};
      if (minPrice !== undefined) where.priceOrRent.gte = minPrice;
      if (maxPrice !== undefined) where.priceOrRent.lte = maxPrice;
    }

    if (minTurnover !== undefined || maxTurnover !== undefined) {
      where.turnover = {};
      if (minTurnover !== undefined) where.turnover.gte = minTurnover;
      if (maxTurnover !== undefined) where.turnover.lte = maxTurnover;
    }

    if (minNetProfit !== undefined || maxNetProfit !== undefined) {
      where.netProfit = {};
      if (minNetProfit !== undefined) where.netProfit.gte = minNetProfit;
      if (maxNetProfit !== undefined) where.netProfit.lte = maxNetProfit;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        select: publicListingSelect,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      data: await Promise.all(data.map(l => this.enrichAndSanitizeListing(l))),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async acceptNda(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.ndaRequired) {
      throw new ConflictException('This listing does not require an NDA');
    }

    // Upsert to handle idempotency safely
    const acceptance = await this.prisma.listingNdaAcceptance.upsert({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        }
      },
      update: {}, // Do nothing if it exists
      create: {
        listingId,
        buyerId,
      }
    });

    return {
      success: true,
      message: 'NDA accepted successfully',
      acceptedAt: acceptance.acceptedAt
    };
  }

  async getNdaStatus(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.ndaRequired) {
      return { ndaRequired: false, accepted: false };
    }

    const nda = await this.prisma.listingNdaAcceptance.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        }
      }
    });

    return { ndaRequired: true, accepted: !!nda };
  }

  async addMedia(sellerId: string, listingId: string, file: Express.Multer.File, type: MediaType) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const normalizedType = (type ? type.toUpperCase() : 'PHOTO') as MediaType;
    if (normalizedType !== 'PHOTO' && normalizedType !== 'VIDEO') {
      throw new BadRequestException('Invalid media type. Must be PHOTO or VIDEO.');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Please upload JPEG, PNG, WebP, MP4, WebM, or MOV files.');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('File is too large. Max size is 50MB.');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const uuid = crypto.randomUUID();
    const s3Key = `listings/${listingId}/media/${uuid}${ext}`;

    await this.s3Service.uploadFile(file, s3Key);

    const currentMaxOrder = listing.media.length > 0 
      ? Math.max(...listing.media.map(m => m.order)) 
      : -1;
    const nextOrder = currentMaxOrder + 1;

    let targetRevisionId: string | null = null;
    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (publicStatuses.includes(listing.status)) {
      let revision = await this.prisma.listingRevision.findFirst({
        where: { listingId, status: { in: ['PENDING', 'REJECTED'] } }
      });
      if (!revision) {
        revision = await this.prisma.listingRevision.create({
          data: {
            listingId,
            createdBy: sellerId,
            status: 'PENDING',
            proposedData: {},
          }
        });
        await this.prisma.listing.update({
          where: { id: listingId },
          data: { status: ListingStatus.CHANGES_PENDING_REVIEW }
        });
      } else if (revision.status === 'REJECTED') {
        revision = await this.prisma.listingRevision.update({
          where: { id: revision.id },
          data: { status: 'PENDING' }
        });
      }
      targetRevisionId = revision.id;
    }

    try {
      const media = await this.prisma.listingMedia.create({
        data: {
          listingId,
          s3Key,
          type: normalizedType,
          order: nextOrder,
          listingRevisionId: targetRevisionId,
        },
      });
      const url = await this.s3Service.generateDownloadUrl(s3Key);
      const mediaResponse = { ...media, url } as any;
      delete mediaResponse.s3Key;
      return mediaResponse;
    } catch (error) {
      await this.s3Service.deleteFile(s3Key);
      throw new InternalServerErrorException('Failed to save media record in database');
    }
  }

  async removeMedia(sellerId: string, listingId: string, mediaId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    const media = await this.prisma.listingMedia.findFirst({
      where: {
        id: mediaId,
        listingId: listingId
      }
    });
    if (!media) {
      throw new NotFoundException('Media not found for this listing');
    }

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (publicStatuses.includes(listing.status)) {
      let revision = await this.prisma.listingRevision.findFirst({
        where: { listingId, status: { in: ['PENDING', 'REJECTED'] } }
      });
      if (!revision) {
        revision = await this.prisma.listingRevision.create({
          data: { listingId, createdBy: sellerId, status: 'PENDING', proposedData: {} }
        });
        await this.prisma.listing.update({
          where: { id: listingId },
          data: { status: ListingStatus.CHANGES_PENDING_REVIEW }
        });
      } else if (revision.status === 'REJECTED') {
        revision = await this.prisma.listingRevision.update({
          where: { id: revision.id },
          data: { status: 'PENDING' }
        });
      }

      if (media.listingRevisionId === revision.id) {
        if (media.s3Key) await this.s3Service.deleteFile(media.s3Key);
        await this.prisma.listingMedia.delete({ where: { id: mediaId } });
        return { success: true, message: 'Media removed successfully' };
      } else {
        let proposedData = revision.proposedData && typeof revision.proposedData === 'object' ? revision.proposedData : {};
        const deletions = Array.isArray((proposedData as any).proposedMediaDeletions) ? (proposedData as any).proposedMediaDeletions : [];
        if (!deletions.includes(mediaId)) {
          deletions.push(mediaId);
        }
        proposedData = { ...(proposedData as any), proposedMediaDeletions: deletions };
        await this.prisma.listingRevision.update({
          where: { id: revision.id },
          data: { status: 'PENDING', proposedData }
        });
        return { success: true, message: 'Media marked for removal pending admin approval' };
      }
    }

    if (media.s3Key) {
      await this.s3Service.deleteFile(media.s3Key);
    }

    await this.prisma.listingMedia.delete({ where: { id: mediaId } });

    return { success: true, message: 'Media removed successfully' };
  }

  async reorderMedia(sellerId: string, listingId: string, dto: ReorderListingMediaDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    const existingMediaIds = listing.media.map(m => m.id);
    const providedMediaIds = dto.mediaIds;

    // Validate no duplicates
    const uniqueProvidedIds = new Set(providedMediaIds);
    if (uniqueProvidedIds.size !== providedMediaIds.length) {
      throw new BadRequestException('Duplicate media IDs provided');
    }

    // Validate all provided IDs exist in the listing
    const allProvidedExist = providedMediaIds.every(id => existingMediaIds.includes(id));
    if (!allProvidedExist) {
      throw new BadRequestException('One or more media IDs do not belong to this listing');
    }

    // Validate that all listing media are included (if required to be complete set)
    if (existingMediaIds.length !== providedMediaIds.length) {
      throw new BadRequestException('Must provide all media IDs for reordering');
    }

    // Execute in transaction
    await this.prisma.$transaction(
      providedMediaIds.map((mediaId, index) =>
        this.prisma.listingMedia.update({
          where: { id: mediaId },
          data: { order: index },
        })
      )
    );

    return { success: true, message: 'Media reordered successfully' };
  }

  // --- Seller Onboarding Methods ---

  async startOnboardingApplication(userId: string, createListingDto: CreateListingDto) {
    const activeApp = await this.prisma.listing.findFirst({
      where: {
        sellerId: userId,
        status: { in: [ListingStatus.DRAFT, ListingStatus.SUBMITTED_FOR_REVIEW, ListingStatus.REJECTED] }
      }
    });

    if (activeApp) {
      throw new ConflictException('You already have an active seller application. Please update it instead of creating a new one.');
    }

    const listing = await this.prisma.listing.create({
      data: {
        ...createListingDto,
        sellerId: userId,
        status: ListingStatus.DRAFT,
      },
      include: {
        media: true,
      }
    });

    return await this.enrichAndSanitizeListing(listing, { id: userId });
  }

  async updateOnboardingApplication(userId: string, id: string, updateListingDto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Application not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your application');
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) {
      throw new ConflictException('Application cannot be edited in its current state');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
      include: { media: true }
    });
    return await this.enrichAndSanitizeListing(updated, { id: userId });
  }

  async submitOnboardingApplication(userId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Application not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your application');
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) {
      throw new ConflictException('Only DRAFT or REJECTED applications can be submitted for review');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.SUBMITTED_FOR_REVIEW },
      include: { media: true }
    });
    return await this.enrichAndSanitizeListing(updated, { id: userId });
  }

  async addOnboardingMedia(userId: string, listingId: string, file: Express.Multer.File, type: MediaType) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Application not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your application');
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) {
      throw new ConflictException('Cannot modify media in current application state');
    }
    return this.addMedia(userId, listingId, file, type);
  }

  async removeOnboardingMedia(userId: string, listingId: string, mediaId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Application not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your application');
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) {
      throw new ConflictException('Cannot modify media in current application state');
    }
    return this.removeMedia(userId, listingId, mediaId);
  }

  async reorderOnboardingMedia(userId: string, listingId: string, dto: ReorderListingMediaDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Application not found');
    if (listing.sellerId !== userId) throw new ForbiddenException('Not your application');
    if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) {
      throw new ConflictException('Cannot modify media in current application state');
    }
    return this.reorderMedia(userId, listingId, dto);
  }

  async setCoverMedia(sellerId: string, listingId: string, mediaId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== sellerId) throw new ForbiddenException('You do not own this listing');

    const media = await this.prisma.listingMedia.findUnique({ where: { id: mediaId } });
    if (!media) throw new NotFoundException('Media not found');
    if (media.listingId !== listingId) throw new BadRequestException('Media does not belong to this listing');
    if (media.type !== MediaType.PHOTO) throw new BadRequestException('Only PHOTO can be set as cover');

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: { coverMediaId: mediaId },
      include: { media: true }
    });
    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async removeCoverMedia(sellerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== sellerId) throw new ForbiddenException('You do not own this listing');

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: { coverMediaId: null },
      include: { media: true }
    });
    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async getSellerContact(listingId: string, buyerId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true }
    });

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES];
    if (!listing || !publicStatuses.includes(listing.status)) {
      throw new NotFoundException('Listing not found');
    }


    // Only enforce NDA check if the requester is not the seller themselves
    if (listing.ndaRequired && listing.sellerId !== buyerId) {
      const nda = await this.prisma.listingNdaAcceptance.findUnique({
        where: {
          listingId_buyerId: {
            listingId,
            buyerId,
          }
        }
      });
      if (!nda) {
        throw new ForbiddenException({
          code: 'NDA_REQUIRED',
          message: 'NDA acceptance is required before accessing seller contact details.'
        });
      }
    }

    return {
      success: true,
      data: {
        seller: {
          contactName: listing.contactName || null,
          contactEmail: listing.contactEmail || null,
          contactPhone: listing.contactPhone || null,
        }
      }
    };
  }

  // Ensure internal properties and seller objects are not blindly exposed

  private async enrichAndSanitizeListing(listing: any, reqUser?: any) {
    if (listing.seller) {
      // If we ever eager load the seller, strip sensitive fields!
      delete listing.seller.passwordHash;
      delete listing.seller.email;
      delete listing.seller.phone;
    }
    
    // listing-specific contact info is excluded via Prisma `select` whitelisting,
    // but we can ensure it's removed here as a final fallback if it somehow sneaks in.
    const isOwner = reqUser && reqUser.id === listing.sellerId;
    const isAdmin = reqUser && reqUser.roles?.includes('ADMIN');
    
    if (!isOwner && !isAdmin) {
      delete listing.contactName;
      delete listing.contactEmail;
      delete listing.contactPhone;

      if (listing.media && Array.isArray(listing.media)) {
        listing.media = listing.media.filter((m: any) => m.listingRevisionId === null);
      }
    }

    if (listing.media && Array.isArray(listing.media)) {
      await Promise.all(
        listing.media.map(async (m: any) => {
          if (m.s3Key) {
            m.url = await this.s3Service.generateDownloadUrl(m.s3Key);
            delete m.s3Key;
          }
        })
      );
    }
    
    return listing;
  }

  async getPendingRevision(sellerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to view this listing revision');
    }

    const revision = await this.prisma.listingRevision.findFirst({
      where: {
        listingId,
        status: { in: ['PENDING', 'REJECTED'] }
      },
      include: {
        media: true
      }
    });

    return revision;
  }

  async getAdminPendingRevision(listingId: string) {
    const revision = await this.prisma.listingRevision.findFirst({
      where: { listingId, status: { in: ['PENDING', 'REJECTED'] } },
      include: { media: true }
    });
    if (!revision) {
      throw new NotFoundException('No pending revision found');
    }
    const currentListing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: { where: { listingRevisionId: null } } }
    });
    return { revision, currentListing };
  }

  async approveRevision(adminId: string, listingId: string) {
    const revision = await this.prisma.listingRevision.findFirst({
      where: { listingId, status: 'PENDING' },
      include: { media: true }
    });
    if (!revision) {
      throw new ConflictException('No pending revision to approve');
    }

    const proposedData = (revision.proposedData as any) || {};
    const mediaDeletions = Array.isArray(proposedData.proposedMediaDeletions) ? proposedData.proposedMediaDeletions : [];

    for (const mediaId of mediaDeletions) {
      const media = await this.prisma.listingMedia.findUnique({ where: { id: mediaId } });
      if (media && media.s3Key) {
        await this.s3Service.deleteFile(media.s3Key);
      }
    }

    delete proposedData.proposedMediaDeletions;

    const [updated] = await this.prisma.$transaction([
      this.prisma.listingMedia.deleteMany({
        where: { id: { in: mediaDeletions } }
      }),
      this.prisma.listingMedia.updateMany({
        where: { listingRevisionId: revision.id },
        data: { listingRevisionId: null }
      }),
      this.prisma.listingRevision.update({
        where: { id: revision.id },
        data: { status: 'APPROVED', reviewedAt: new Date(), reviewedBy: adminId }
      }),
      this.prisma.listing.update({
        where: { id: listingId },
        data: {
          ...proposedData,
          status: ListingStatus.PUBLISHED,
          rejectionReasonCode: null,
        },
        include: { media: true }
      }),
      this.prisma.adminActionLog.create({
        data: {
          adminId,
          actionType: 'REVISION_APPROVED',
          targetEntity: `Listing:${listingId}`,
        }
      })
    ]);

    return await this.enrichAndSanitizeListing(updated);
  }

  async rejectRevision(adminId: string, listingId: string, dto: RejectListingDto) {
    const revision = await this.prisma.listingRevision.findFirst({
      where: { listingId, status: 'PENDING' }
    });
    if (!revision) {
      throw new ConflictException('No pending revision to reject');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.listingRevision.update({
        where: { id: revision.id },
        data: { status: 'REJECTED', reviewedAt: new Date(), reviewedBy: adminId, rejectionReason: dto.rejectionReasonCode }
      }),
      this.prisma.listing.update({
        where: { id: listingId },
        data: { status: ListingStatus.REJECTED_CHANGES },
        include: { media: true }
      }),
      this.prisma.adminActionLog.create({
        data: {
          adminId,
          actionType: 'REVISION_REJECTED',
          targetEntity: `Listing:${listingId}`,
          reason: dto.rejectionReasonCode,
        }
      })
    ]);

    return await this.enrichAndSanitizeListing(updated);
  }
}
