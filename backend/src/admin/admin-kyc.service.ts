import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { KycStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminKycService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    @Inject(forwardRef(() => NotificationsService)) private notificationsService: NotificationsService
  ) {}

  async getKycApplications() {
    const applications = await this.prisma.sellerProfile.findMany({
      where: {
        kycStatus: { in: [KycStatus.PENDING, KycStatus.APPROVED, KycStatus.REJECTED] },
        kycSubmittedAt: { not: null }
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
        kycRejectionReason: null,
        businessName: profile.legalName || profile.businessName
      }
    });

    await this.prisma.adminActionLog.create({
      data: {
        adminId,
        actionType: 'KYC_APPROVED',
        targetEntity: `SellerProfile:${sellerProfileId}`,
      }
    });

    await this.notificationsService.createNotification({
      userId: profile.userId,
      type: 'KYC_APPROVED',
      title: 'KYC Approved',
      message: 'Your business verification has been successfully approved.',
      link: '/seller/kyc',
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

    await this.notificationsService.createNotification({
      userId: profile.userId,
      type: 'KYC_REJECTED',
      title: 'KYC Rejected',
      message: `Your business verification was rejected. Reason: ${reason}`,
      link: '/seller/kyc',
    });

    return { success: true };
  }
}
