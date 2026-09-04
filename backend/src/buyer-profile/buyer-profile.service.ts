import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { UpdateBuyerProfileDto } from './dto/update-buyer-profile.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class BuyerProfileService {
  private readonly logger = new Logger(BuyerProfileService.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Default values if no profile exists
    const profile = user.buyerProfile || {
      company: '',
      jobTitle: '',
      location: '',
      bio: '',
      buyerType: 'Corporate',
      website: '',
      linkedin: '',
      avatarKey: null,
    };

    let avatarUrl: string | null = null;
    if (profile.avatarKey) {
      try {
        // Generate short-lived presigned URL
        avatarUrl = await this.s3Service.generateDownloadUrl(profile.avatarKey, 3600); // 1 hour expiry
      } catch (err) {
        this.logger.error(`Failed to generate presigned URL for avatarKey: ${profile.avatarKey}`);
        // don't fail the request, just leave avatarUrl as null
      }
    }

    return {
      fullName: user.name,
      email: user.email,
      phone: user.phone || '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || '',
      location: profile.location || '',
      bio: profile.bio || '',
      buyerType: profile.buyerType || 'Corporate',
      website: profile.website || '',
      linkedin: profile.linkedin || '',
      avatarUrl,
    };
  }

  async updateProfile(userId: string, dto: UpdateBuyerProfileDto) {
    // 1. Update User level fields if provided
    if (dto.fullName !== undefined || dto.email !== undefined || dto.phone !== undefined) {
      const userUpdate: any = {};
      if (dto.fullName !== undefined) userUpdate.name = dto.fullName;
      if (dto.email !== undefined) userUpdate.email = dto.email;
      if (dto.phone !== undefined) userUpdate.phone = dto.phone;
      
      await this.prisma.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }

    // 2. Upsert BuyerProfile
    const profileData: any = {};
    if (dto.company !== undefined) profileData.company = dto.company;
    if (dto.jobTitle !== undefined) profileData.jobTitle = dto.jobTitle;
    if (dto.location !== undefined) profileData.location = dto.location;
    if (dto.bio !== undefined) profileData.bio = dto.bio;
    if (dto.buyerType !== undefined) profileData.buyerType = dto.buyerType;
    if (dto.website !== undefined) profileData.website = dto.website;
    if (dto.linkedin !== undefined) profileData.linkedin = dto.linkedin;

    await this.prisma.buyerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData,
      },
      update: profileData,
    });

    return this.getProfile(userId);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate Size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }

    const ext = file.originalname.split('.').pop();
    const key = `buyer-profiles/${userId}/avatar-${crypto.randomUUID()}.${ext}`;

    // Upload to S3
    let uploadedKey: string;
    try {
      uploadedKey = await this.s3Service.uploadFile(file, key);
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload avatar to S3');
    }

    // Get current profile to find old avatar key
    const profile = await this.prisma.buyerProfile.findUnique({
      where: { userId },
    });
    
    const oldAvatarKey = profile?.avatarKey;

    // Update DB with new avatar key
    try {
      await this.prisma.buyerProfile.upsert({
        where: { userId },
        create: {
          userId,
          avatarKey: uploadedKey,
        },
        update: {
          avatarKey: uploadedKey,
        },
      });
    } catch (error) {
      // If DB update fails, try to cleanup the new S3 file to avoid orphans
      try {
        await this.s3Service.deleteFile(uploadedKey);
      } catch (e) {}
      throw new InternalServerErrorException('Failed to update profile avatar reference');
    }

    // Safely delete old avatar
    if (oldAvatarKey) {
      try {
        await this.s3Service.deleteFile(oldAvatarKey);
      } catch (error) {
        this.logger.warn(`Failed to delete old avatar object: ${oldAvatarKey}. Proceeding without error.`);
      }
    }

    // Return the updated profile
    return this.getProfile(userId);
  }
}
