import { Controller, Get, Patch, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { BuyerProfileService } from './buyer-profile.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateBuyerProfileDto } from './dto/update-buyer-profile.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('users/me/buyer-profile')
@UseGuards(JwtAuthGuard)
export class BuyerProfileController {
  constructor(private readonly buyerProfileService: BuyerProfileService) {}

  @Get()
  getProfile(@Request() req: any) {
    return this.buyerProfileService.getProfile(req.user.id);
  }

  @Patch()
  updateProfile(@Request() req: any, @Body() updateDto: UpdateBuyerProfileDto) {
    return this.buyerProfileService.updateProfile(req.user.id, updateDto);
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
    return this.buyerProfileService.uploadAvatar(req.user.id, file);
  }
}
