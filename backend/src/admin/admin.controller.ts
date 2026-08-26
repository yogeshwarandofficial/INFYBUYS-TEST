import { Controller, Post, Get, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ListingsService } from '../listings/listings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';
import { RejectListingDto } from './dto/reject-listing.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post('listings/:id/approve')
  approveListing(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.approveListing(req.user.id, id);
  }

  @Post('listings/:id/reject')
  rejectListing(
    @Request() req: any,
    @Param('id') id: string,
    @Body() rejectListingDto: RejectListingDto,
  ) {
    return this.listingsService.rejectListing(req.user.id, id, rejectListingDto);
  }

  @Get('listings/:id')
  getListing(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.findOne(id, req.user);
  }
}
