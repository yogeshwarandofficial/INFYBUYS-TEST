import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingQueryDto } from './dto/listing-query.dto.js';
import { AddListingMediaDto } from './dto/add-listing-media.dto.js';
import { ReorderListingMediaDto } from './dto/reorder-listing-media.dto.js';
import { RejectListingDto } from '../admin/dto/reject-listing.dto.js';
import { ListingStatus, MediaType, Role, KycStatus } from '../../generated/prisma/client.js';
import { NotificationsService } from '../notifications/notifications.service';
import * as crypto from 'crypto';
import * as path from 'path';

export const publicListingSelect = {
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
  media: { where: { listingRevisionId: null } },
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  coverMediaId: true,
};

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    @Inject(forwardRef(() => NotificationsService)) private readonly notificationsService: NotificationsService
  ) {}

  async create(sellerId: string, createListingDto: CreateListingDto) {
    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId: sellerId }
    });

    if (!sellerProfile || sellerProfile.kycStatus !== KycStatus.APPROVED) {
      if (sellerProfile?.kycStatus === KycStatus.REJECTED) {
        throw new ForbiddenException({
          code: 'KYC_REJECTED',
          message: sellerProfile.kycRejectionReason ? `Your KYC application was rejected. Reason: ${sellerProfile.kycRejectionReason}` : 'Your KYC application was rejected.'
        });
      }
      throw new ForbiddenException({
        code: 'KYC_REQUIRED',
        message: 'Seller KYC approval is required before creating a listing.'
      });
    }

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
            sellerProfile: {
              select: {
                businessName: true,
                avatarKey: true,
                sellerType: true,
                location: true,
                verifiedBadge: true
              }
            },
            receivedReviews: {
              select: { rating: true }
            },
            listings: {
              where: { status: 'SOLD_LET' },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const isOwner = user && user.id === listing.sellerId;
    const isAdmin = user && user.roles?.includes(Role.ADMIN);

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES, ListingStatus.SOLD_LET];
    if (!publicStatuses.includes(listing.status)) {
      if (!isOwner && !isAdmin) {
        throw new NotFoundException('Listing not found');
      }
    }

    let hasAccess = false;
    if (user && user.userSubscriptions && user.userSubscriptions.length > 0) {
      if (listing.ndaRequired) {
        const nda = await this.prisma.ndaAgreement.findUnique({
          where: {
            listingId_buyerId: {
              listingId: id,
              buyerId: user.id
            }
          }
        });
        if (nda && nda.status === 'SIGNED') {
          hasAccess = true;
        }
      } else {
        hasAccess = true;
      }
    }

    // Record view asynchronously if not owner and not admin
    if (!isOwner && !isAdmin) {
      this.prisma.listingView.create({
        data: {
          listingId: id,
          viewerId: user?.id || null,
        }
      }).catch((err: any) => console.error('Failed to record view:', err));
    }

    return await this.enrichAndSanitizeListing(listing, user, { hasAccess });
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

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES, ListingStatus.SOLD_LET];
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

    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId: sellerId }
    });

    if (!sellerProfile || sellerProfile.kycStatus !== KycStatus.APPROVED) {
      if (sellerProfile?.kycStatus === KycStatus.REJECTED) {
        throw new ForbiddenException({
          code: 'KYC_REJECTED',
          message: sellerProfile.kycRejectionReason ? `Your KYC application was rejected. Reason: ${sellerProfile.kycRejectionReason}` : 'Your KYC application was rejected.'
        });
      }
      throw new ForbiddenException({
        code: 'KYC_REQUIRED',
        message: 'Seller KYC approval is required before submitting a listing.'
      });
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.SUBMITTED_FOR_REVIEW },
      include: { media: true }
    });

    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async markAsSold(sellerId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES, ListingStatus.SOLD_LET];
    if (!publicStatuses.includes(listing.status)) {
      throw new ConflictException('Only active listings can be marked as sold');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.SOLD_LET },
      include: { media: true }
    });

    return await this.enrichAndSanitizeListing(updated, { id: sellerId });
  }

  async markAsActive(sellerId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    if (listing.status !== ListingStatus.SOLD_LET && listing.status !== ListingStatus.PAUSED) {
      throw new ConflictException('Only sold or archived listings can be marked as active');
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.PUBLISHED },
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

    await this.notificationsService.createNotification({
      userId: listing.sellerId,
      type: 'LISTING_APPROVED',
      title: 'Listing Approved',
      message: `Your listing "${listing.title}" has been approved and is now live.`,
      link: `/seller/listings/${listing.id}`,
    });

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

    await this.notificationsService.createNotification({
      userId: listing.sellerId,
      type: 'LISTING_REJECTED',
      title: 'Listing Rejected',
      message: `Your listing "${listing.title}" was rejected. Reason: ${dto.rejectionReasonCode}`,
      link: `/seller/listings/${listing.id}`,
    });

    return await this.enrichAndSanitizeListing(updated);
  }

  async search(query: ListingQueryDto, options?: { isAdmin?: boolean }) {
    const {
      type,
      listingType,
      category,
      locationArea,
      locationPostcode,
      location,
      search,
      sort,
      minPrice,
      maxPrice,
      minTurnover,
      maxTurnover,
      minNetProfit,
      maxNetProfit,
      status,
      sellerId,
      page = 1,
      limit = 20,
    } = query || {};

    const activeType = listingType || type;

    // Base query: ONLY published listings for normal search unless explicitly filtered (which we'll restrict if not admin/seller)
    const where: any = {};
    if (options?.isAdmin) {
      if (status) {
        where.status = status;
      }
    } else {
      where.status = { in: [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES, ListingStatus.SOLD_LET] };
    }

    if (activeType) where.type = activeType;
    if (category) where.category = category;
    if (sellerId) where.sellerId = sellerId;
    
    if (location) {
      where.OR = [
        ...(where.OR || []),
        { locationArea: { contains: location, mode: 'insensitive' } },
        { locationPostcode: { contains: location, mode: 'insensitive' } },
        { locationExact: { contains: location, mode: 'insensitive' } }
      ];
    } else {
      if (locationArea) where.locationArea = { contains: locationArea, mode: 'insensitive' };
      if (locationPostcode) where.locationPostcode = { contains: locationPostcode, mode: 'insensitive' };
    }
    
    if (search) {
      // Create search conditions
      const searchConditions = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { locationArea: { contains: search, mode: 'insensitive' } },
        { locationPostcode: { contains: search, mode: 'insensitive' } },
        { locationExact: { contains: search, mode: 'insensitive' } }
      ];

      if (where.OR) {
        // If OR already exists (e.g. from location), we must wrap both in an AND
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions }
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

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

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { priceOrRent: 'asc' };
    if (sort === 'price_high') orderBy = { priceOrRent: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        select: {
          ...publicListingSelect,
          seller: {
            select: {
              id: true,
              name: true,
              sellerProfile: {
                select: {
                  businessName: true,
                  avatarKey: true,
                  sellerType: true,
                  location: true,
                  verifiedBadge: true
                }
              },
              receivedReviews: { select: { rating: true } },
              listings: { where: { status: 'SOLD_LET' }, select: { id: true } }
            }
          }
        },
        orderBy
      })
    ]);

    return {
      data: await Promise.all(data.map(l => this.enrichAndSanitizeListing(l, null, options))),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
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

    try {
      const media = await this.prisma.listingMedia.create({
        data: {
          listingId,
          s3Key,
          type: normalizedType,
          order: nextOrder,
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

    const publicStatuses: ListingStatus[] = [ListingStatus.PUBLISHED, ListingStatus.CHANGES_PENDING_REVIEW, ListingStatus.REJECTED_CHANGES, ListingStatus.SOLD_LET];
    if (!listing || !publicStatuses.includes(listing.status)) {
      throw new NotFoundException('Listing not found');
    }


    // Only enforce NDA check if the requester is not the seller themselves
    if (listing.ndaRequired && listing.sellerId !== buyerId) {
      const nda = await this.prisma.ndaAgreement.findUnique({
        where: {
          listingId_buyerId: {
            listingId,
            buyerId,
          }
        }
      });
      if (!nda || nda.status !== 'SIGNED') {
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

  async enrichAndSanitizeListing(listing: any, reqUser?: any, options?: { hasAccess?: boolean, isAdmin?: boolean }) {
    if (listing.seller) {
      if (listing.seller.receivedReviews) {
        if (listing.seller.receivedReviews.length > 0) {
          const sum = listing.seller.receivedReviews.reduce((a: number, b: any) => a + b.rating, 0);
          listing.seller.rating = Math.round((sum / listing.seller.receivedReviews.length) * 10) / 10;
        } else {
          listing.seller.rating = 0;
        }
        delete listing.seller.receivedReviews;
      }
      
      if (listing.seller.listings) {
        listing.seller.completedDeals = listing.seller.listings.length;
        delete listing.seller.listings;
      }

      if (listing.seller.sellerProfile) {
        listing.seller.verified = !!listing.seller.sellerProfile.verifiedBadge;
      } else {
        listing.seller.verified = false;
      }

      // If we ever eager load the seller, strip sensitive fields!
      delete listing.seller.passwordHash;
      delete listing.seller.email;
      delete listing.seller.phone;
    }
    
    // listing-specific contact info is excluded via Prisma `select` whitelisting,
    // but we can ensure it's removed here as a final fallback if it somehow sneaks in.
    const isOwner = reqUser && reqUser.id === listing.sellerId;
    const isAdmin = (reqUser && reqUser.roles?.includes('ADMIN')) || options?.isAdmin === true;
    
    let hasAccess = isOwner || isAdmin || options?.hasAccess === true;
    
    if (!hasAccess && reqUser && reqUser.userSubscriptions && reqUser.userSubscriptions.length > 0) {
       if (!listing.ndaRequired) {
         hasAccess = true;
       }
    }

    if (!isOwner && !isAdmin) {
      delete listing.contactName;
      delete listing.contactEmail;
      delete listing.contactPhone;

      if (listing.media && Array.isArray(listing.media)) {
        listing.media = listing.media.filter((m: any) => m.listingRevisionId === null);
      }

      // Mask internal statuses so the public and buyers continue to see the active listing
      if (
        listing.status === ListingStatus.CHANGES_PENDING_REVIEW ||
        listing.status === ListingStatus.REJECTED_CHANGES
      ) {
        listing.status = ListingStatus.PUBLISHED;
      }
    }
    
    // Financials (turnover, netProfit) are now public so they can be shown on the Listing Cards

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

    const [,, revisionUpdated, updatedListing, log] = await this.prisma.$transaction([
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

    await this.notificationsService.createNotification({
      userId: updatedListing.sellerId,
      type: 'LISTING_APPROVED',
      title: 'Revision Approved',
      message: `Your requested changes for "${updatedListing.title}" have been approved.`,
      link: `/seller/listings/${updatedListing.id}`,
    });

    return await this.enrichAndSanitizeListing(updatedListing);
  }

  async rejectRevision(adminId: string, listingId: string, dto: RejectListingDto) {
    const revision = await this.prisma.listingRevision.findFirst({
      where: { listingId, status: 'PENDING' }
    });
    if (!revision) {
      throw new ConflictException('No pending revision to reject');
    }

    const [revisionUpdated, updatedListing, log] = await this.prisma.$transaction([
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

    await this.notificationsService.createNotification({
      userId: updatedListing.sellerId,
      type: 'LISTING_REJECTED',
      title: 'Revision Rejected',
      message: `Your requested changes for "${updatedListing.title}" were rejected. Reason: ${dto.rejectionReasonCode}`,
      link: `/seller/listings/${updatedListing.id}`,
    });

    return await this.enrichAndSanitizeListing(updatedListing);
  }
}
