import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class SellerProfileService {
  private readonly logger = new Logger(SellerProfileService.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sellerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Default values if no profile exists
    // Note: Some fields like businessName are required in DB, so if they don't exist, we provide sensible defaults for frontend parsing.
    const profile = user.sellerProfile || {
      businessName: '',
      legalName: null,
      phone: '',
      jobTitle: '',
      location: '',
      bio: '',
      sellerType: 'broker',
      website: '',
      linkedin: '',
      yearsOfExperience: '',
      preferredCategories: [],
      preferredLocations: [],
      avatarKey: null,
    };

    let avatarUrl: string | null = null;
    if (profile.avatarKey) {
      try {
        // Generate short-lived presigned URL
        avatarUrl = await this.s3Service.generateDownloadUrl(profile.avatarKey, 3600); // 1 hour expiry
      } catch (err) {
        this.logger.error(`Failed to generate presigned URL for avatar: ${profile.avatarKey}`, err);
        // Don't fail the request if image generation fails, just return null for the image
        avatarUrl = null;
      }
    }

    return {
      success: true,
      data: {
        id: user.id,
        fullName: user.name,
        email: user.email,
        phone: profile.phone || '',
        companyName: profile.legalName || profile.businessName || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        bio: profile.bio || '',
        sellerType: profile.sellerType || 'broker',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        preferredCategories: profile.preferredCategories || [],
        preferredLocations: profile.preferredLocations || [],
        avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async updateProfile(userId: string, updateDto: UpdateSellerProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let updatedProfile;

    if (user.sellerProfile) {
      // Update existing profile
      updatedProfile = await this.prisma.sellerProfile.update({
        where: { userId },
        data: {
          ...updateDto,
        },
      });
    } else {
      // Create new profile
      updatedProfile = await this.prisma.sellerProfile.create({
        data: {
          userId,
          businessName: user.name || 'Unknown Business', // Fallback as businessName is required
          ...updateDto,
        },
      });
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    try {
      // Create a unique key for the avatar
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const randomString = crypto.randomBytes(8).toString('hex');
      const s3Key = `avatars/seller/${userId}/${randomString}.${fileExt}`;

      // Upload to S3 using S3Service
      const uploadResultKey = await this.s3Service.uploadFile(file, s3Key);

      // If user has an existing avatar, we should ideally delete it to save space
      if (user.sellerProfile?.avatarKey) {
        try {
          await this.s3Service.deleteFile(user.sellerProfile.avatarKey);
        } catch (deleteErr) {
          this.logger.warn(`Failed to delete old avatar ${user.sellerProfile.avatarKey}`, deleteErr);
          // Continue execution, not a critical failure
        }
      }

      // Update the database
      if (user.sellerProfile) {
        await this.prisma.sellerProfile.update({
          where: { userId },
          data: { avatarKey: uploadResultKey },
        });
      } else {
        await this.prisma.sellerProfile.create({
          data: {
            userId,
            businessName: user.name || 'Unknown Business',
            avatarKey: uploadResultKey,
          },
        });
      }

      // Generate a new download URL to return immediately
      const avatarUrl = await this.s3Service.generateDownloadUrl(uploadResultKey, 3600);

      return {
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatarUrl,
        },
      };
    } catch (error) {
      this.logger.error(`Error uploading avatar for user ${userId}`, error);
      throw new InternalServerErrorException('Failed to upload avatar');
    }
  }
}
