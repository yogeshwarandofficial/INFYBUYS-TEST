import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingQueryDto } from './dto/listing-query.dto.js';
import { AddListingMediaDto } from './dto/add-listing-media.dto.js';
import { ReorderListingMediaDto } from './dto/reorder-listing-media.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, MediaType, SubscriptionAudience } from '../../generated/prisma/client.js';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard.js';
import { SubscriptionGuard } from '../auth/guards/subscription.guard.js';
import { RequiresSubscription } from '../auth/decorators/subscription.decorator.js';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(req.user.id, createListingDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyListings(@Request() req: any) {
    return this.listingsService.findSellerListings(req.user.id);
  }

  @Get()
  findAll(@Query() query: ListingQueryDto) {
    return this.listingsService.search(query);
  }

  @Get('admin/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminSearch(@Query() query: ListingQueryDto) {
    return this.listingsService.search(query, { isAdmin: true });
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto
  ) {
    return this.listingsService.update(req.user.id, id, updateListingDto);
  }

  @Get(':id/revision')
  @UseGuards(JwtAuthGuard)
  getRevision(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.getPendingRevision(req.user.id, id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  submitForReview(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.submitForReview(req.user.id, id);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  approveListing(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.approveListing(req.user.id, id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  rejectListing(@Request() req: any, @Param('id') id: string, @Body() body: { reason?: string }) {
    return this.listingsService.rejectListing(req.user.id, id, { rejectionReasonCode: body?.reason || 'Rejected by admin' });
  }

  @Get(':id/nda')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  getNdaStatus(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.getNdaStatus(req.user.id, id);
  }

  @Post(':id/nda/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  acceptNda(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.acceptNda(req.user.id, id);
  }
  @Post(':id/media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  addMedia(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: MediaType
  ) {
    return this.listingsService.addMedia(req.user.id, id, file, type);
  }

  @Delete(':id/media/:mediaId')
  @UseGuards(JwtAuthGuard)
  removeMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Param('mediaId') mediaId: string
  ) {
    return this.listingsService.removeMedia(req.user.id, id, mediaId);
  }

  @Patch(':id/media/reorder')
  @UseGuards(JwtAuthGuard)
  reorderMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Body() reorderListingMediaDto: ReorderListingMediaDto
  ) {
    return this.listingsService.reorderMedia(req.user.id, id, reorderListingMediaDto);
  }

  @Patch(':id/media/:mediaId/cover')
  @UseGuards(JwtAuthGuard)
  setCoverMedia(
    @Request() req: any,
    @Param('id') id: string,
    @Param('mediaId') mediaId: string
  ) {
    return this.listingsService.setCoverMedia(req.user.id, id, mediaId);
  }

  @Delete(':id/cover')
  @UseGuards(JwtAuthGuard)
  removeCoverMedia(
    @Request() req: any,
    @Param('id') id: string
  ) {
    return this.listingsService.removeCoverMedia(req.user.id, id);
  }
  @Get(':id/seller-contact')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(Role.BUYER)
  @RequiresSubscription(SubscriptionAudience.BUYER)
  getSellerContact(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.getSellerContact(id, req.user.id);
  }
}
