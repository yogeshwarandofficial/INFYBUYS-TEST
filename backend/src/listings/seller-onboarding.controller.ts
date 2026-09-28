import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ReorderListingMediaDto } from './dto/reorder-listing-media.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MediaType, Role } from '@prisma/client';

@Controller('seller/apply')
@UseGuards(JwtAuthGuard) // Only requires authentication, NO @Roles guard
export class SellerOnboardingController {
  constructor(private readonly listingsService: ListingsService) {}

  private checkEligibility(req: any) {
    if (req.user.roles && req.user.roles.includes(Role.SELLER)) {
      throw new ForbiddenException('You are already an approved seller. Please use the normal listing creation flow.');
    }
  }

  @Post()
  create(@Request() req: any, @Body() createListingDto: CreateListingDto) {
    this.checkEligibility(req);
    return this.listingsService.startOnboardingApplication(req.user.id, createListingDto);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto
  ) {
    this.checkEligibility(req);
    return this.listingsService.updateOnboardingApplication(req.user.id, id, updateListingDto);
  }

  @Post(':id/submit')
  submitForReview(@Request() req: any, @Param('id') id: string) {
    this.checkEligibility(req);
    return this.listingsService.submitOnboardingApplication(req.user.id, id);
  }

  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  addMedia(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: MediaType
  ) {
    this.checkEligibility(req);
    return this.listingsService.addOnboardingMedia(req.user.id, id, file, type);
  }

  @Delete(':id/media/:mediaId')
  removeMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Param('mediaId') mediaId: string
  ) {
    this.checkEligibility(req);
    return this.listingsService.removeOnboardingMedia(req.user.id, id, mediaId);
  }

  @Patch(':id/media/reorder')
  reorderMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Body() reorderListingMediaDto: ReorderListingMediaDto
  ) {
    this.checkEligibility(req);
    return this.listingsService.reorderOnboardingMedia(req.user.id, id, reorderListingMediaDto);
  }
}
