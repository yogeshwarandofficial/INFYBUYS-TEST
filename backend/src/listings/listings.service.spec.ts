import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { ListingStatus, KycStatus } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('ListingsService KYC Validation', () => {
  let service: ListingsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      listing: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      sellerProfile: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: PrismaService, useValue: prisma },
        { provide: S3Service, useValue: {} },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
    // Mock enrichAndSanitizeListing as it's not the subject of these tests
    service['enrichAndSanitizeListing'] = jest.fn().mockImplementation((val) => val);
  });

  describe('submitForReview', () => {
    const listingId = 'listing-1';
    const sellerId = 'seller-1';

    beforeEach(() => {
      prisma.listing.findUnique.mockResolvedValue({
        id: listingId,
        sellerId,
        status: ListingStatus.DRAFT,
      });
      prisma.listing.update.mockResolvedValue({ id: listingId, status: ListingStatus.SUBMITTED_FOR_REVIEW });
    });

    it('should throw KYC_REQUIRED if KYC NOT_STARTED (no seller profile)', async () => {
      prisma.sellerProfile.findUnique.mockResolvedValue(null);
      await expect(service.submitForReview(sellerId, listingId)).rejects.toThrow(
        new ForbiddenException({
          code: 'KYC_REQUIRED',
          message: 'Seller KYC approval is required before submitting a listing.',
        }),
      );
    });

    it('should throw KYC_REQUIRED if KYC PENDING', async () => {
      prisma.sellerProfile.findUnique.mockResolvedValue({
        kycStatus: KycStatus.PENDING,
      });
      await expect(service.submitForReview(sellerId, listingId)).rejects.toThrow(
        new ForbiddenException({
          code: 'KYC_REQUIRED',
          message: 'Seller KYC approval is required before submitting a listing.',
        }),
      );
    });

    it('should throw KYC_REJECTED with reason if KYC REJECTED', async () => {
      prisma.sellerProfile.findUnique.mockResolvedValue({
        kycStatus: KycStatus.REJECTED,
        kycRejectionReason: 'Invalid document',
      });
      await expect(service.submitForReview(sellerId, listingId)).rejects.toThrow(
        new ForbiddenException({
          code: 'KYC_REJECTED',
          message: 'Your KYC application was rejected. Reason: Invalid document',
        }),
      );
    });

    it('should submit listing successfully if KYC APPROVED', async () => {
      prisma.sellerProfile.findUnique.mockResolvedValue({
        kycStatus: KycStatus.APPROVED,
      });
      const result = await service.submitForReview(sellerId, listingId);
      expect(result).toBeDefined();
      expect(prisma.listing.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: listingId },
        data: { status: ListingStatus.SUBMITTED_FOR_REVIEW },
      }));
    });
  });
});
