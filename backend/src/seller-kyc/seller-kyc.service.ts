import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { CompaniesHouseService } from './companies-house.service.js';
import { SubmitKycDto } from './dto/submit-kyc.dto.js';
import { KycStatus, KycDocumentType } from '../../generated/prisma/client.js';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class SellerKycService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private companiesHouseService: CompaniesHouseService
  ) {}

  async getKycStatus(userId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { kycDocuments: true }
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    return {
      status: seller.kycStatus,
      legalName: seller.legalName,
      businessName: seller.businessName,
      businessAddress: seller.businessAddress,
      phone: seller.phone,
      companyNumber: seller.companyNumber,
      submittedAt: seller.kycSubmittedAt,
      reviewedAt: seller.kycReviewedAt,
      rejectionReason: seller.kycRejectionReason,
      documents: seller.kycDocuments.map(doc => ({
        id: doc.id,
        documentType: doc.documentType,
        originalFileName: doc.originalFileName,
        uploadedAt: doc.uploadedAt
      }))
    };
  }

  async submitKyc(userId: string, dto: SubmitKycDto) {
    let seller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { kycDocuments: true }
    });

    if (!seller) {
      seller = await this.prisma.sellerProfile.create({
        data: {
          userId,
          businessName: dto.legalName || "Pending KYC",
        },
        include: { kycDocuments: true }
      });
    }

    if (seller.kycStatus === KycStatus.APPROVED) {
      throw new BadRequestException('KYC is already approved');
    }

    // if (seller.kycDocuments.length === 0) {
    //   throw new BadRequestException('Please upload KYC documents before submitting');
    // }

    await this.prisma.sellerProfile.update({
      where: { userId },
      data: {
        legalName: dto.legalName,
        businessAddress: dto.businessAddress,
        phone: dto.phone,
        companyNumber: dto.companyNumber,
        kycStatus: KycStatus.PENDING,
        kycSubmittedAt: new Date(),
        kycRejectionReason: null
      }
    });

    return { success: true, message: 'KYC submitted successfully' };
  }

  async uploadDocument(userId: string, file: Express.Multer.File, documentType: KycDocumentType) {
    let seller = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    if (!seller) {
      seller = await this.prisma.sellerProfile.create({
        data: {
          userId,
          businessName: "Pending KYC",
        }
      });
    }
    
    if (seller.kycStatus === KycStatus.APPROVED) {
      throw new BadRequestException('Cannot upload documents for approved KYC');
    }

    const documentId = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    const s3Key = `seller-kyc/${seller.id}/${documentId}${extension}`;

    await this.s3Service.uploadFile(file, s3Key);

    const doc = await this.prisma.sellerKycDocument.create({
      data: {
        id: documentId,
        sellerProfileId: seller.id,
        documentType,
        s3Key,
        originalFileName: file.originalname,
        mimeType: file.mimetype
      }
    });

    return {
      id: doc.id,
      documentType: doc.documentType,
      originalFileName: doc.originalFileName,
      uploadedAt: doc.uploadedAt
    };
  }

  async deleteDocument(userId: string, documentId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    if (!seller) throw new NotFoundException('Seller profile not found');

    if (seller.kycStatus === KycStatus.APPROVED) {
      throw new BadRequestException('Cannot delete documents from approved KYC');
    }

    const doc = await this.prisma.sellerKycDocument.findFirst({
      where: { id: documentId, sellerProfileId: seller.id }
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    await this.s3Service.deleteFile(doc.s3Key);
    await this.prisma.sellerKycDocument.delete({ where: { id: documentId } });

    return { success: true };
  }

  async lookupCompany(companyNumber: string) {
    return this.companiesHouseService.lookupCompany(companyNumber);
  }
}
