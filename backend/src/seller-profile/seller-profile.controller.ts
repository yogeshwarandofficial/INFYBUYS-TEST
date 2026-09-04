import { Controller, Get, Patch, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SellerProfileService } from './seller-profile.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('users/me/seller-profile')
@UseGuards(JwtAuthGuard)
export class SellerProfileController {
  constructor(private readonly sellerProfileService: SellerProfileService) {}

  @Get()
  getProfile(@Request() req: any) {
    return this.sellerProfileService.getProfile(req.user.id);
  }

  @Patch()
  updateProfile(@Request() req: any, @Body() updateDto: UpdateSellerProfileDto) {
    return this.sellerProfileService.updateProfile(req.user.id, updateDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.sellerProfileService.uploadAvatar(req.user.id, file);
  }
}
