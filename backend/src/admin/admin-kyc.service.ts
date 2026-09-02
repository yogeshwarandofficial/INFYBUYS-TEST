import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { KycStatus } from '../../generated/prisma/client.js';

@Injectable()
export class AdminKycService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async getKycApplications() {
    const applications = await this.prisma.sellerProfile.findMany({
      where: {
        kycStatus: { in: [KycStatus.PENDING, KycStatus.APPROVED, KycStatus.REJECTED] }
      },
      include: {
        user: { select: { name: true, email: true, phone: true } }
      },
      orderBy: { kycSubmittedAt: 'desc' }
    });

    return applications;
  }

  async getKycDetails(sellerProfileId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerProfileId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        kycDocuments: true
      }
    });

    if (!profile) throw new NotFoundException('KYC application not found');

    const documentsWithUrls = await Promise.all(
      profile.kycDocuments.map(async (doc) => {
        const url = await this.s3Service.generateDownloadUrl(doc.s3Key);
        return { ...doc, url };
      })
    );

    return { ...profile, kycDocuments: documentsWithUrls };
  }

  async approveKyc(adminId: string, sellerProfileId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({ where: { id: sellerProfileId } });
    if (!profile) throw new NotFoundException('KYC application not found');
    if (profile.kycStatus === KycStatus.APPROVED) throw new BadRequestException('Already approved');

    await this.prisma.sellerProfile.update({
      where: { id: sellerProfileId },
      data: {
        kycStatus: KycStatus.APPROVED,
        kycReviewedAt: new Date(),
        kycReviewedBy: adminId,
        kycRejectionReason: null
      }
    });

    await this.prisma.adminActionLog.create({
      data: {
        adminId,
        actionType: 'KYC_APPROVED',
        targetEntity: `SellerProfile:${sellerProfileId}`,
      }
    });

    return { success: true };
  }

  async rejectKyc(adminId: string, sellerProfileId: string, reason: string) {
    if (!reason) throw new BadRequestException('Rejection reason is required');

    const profile = await this.prisma.sellerProfile.findUnique({ where: { id: sellerProfileId } });
    if (!profile) throw new NotFoundException('KYC application not found');

    await this.prisma.sellerProfile.update({
      where: { id: sellerProfileId },
      data: {
        kycStatus: KycStatus.REJECTED,
        kycReviewedAt: new Date(),
        kycReviewedBy: adminId,
        kycRejectionReason: reason
      }
    });

    await this.prisma.adminActionLog.create({
      data: {
        adminId,
        actionType: 'KYC_REJECTED',
        targetEntity: `SellerProfile:${sellerProfileId}`,
        reason
      }
    });

    return { success: true };
  }
}
