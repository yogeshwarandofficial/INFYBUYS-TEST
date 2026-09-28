import { Controller, Post, Get, Param, Body, Request, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from '../listings/listings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { RejectListingDto } from './dto/reject-listing.dto.js';
import { AdminService } from './admin.service.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly adminService: AdminService
  ) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users/stats')
  getUserStats() {
    return this.adminService.getUserStats();
  }

  @Get('analytics')
  getAnalytics(@Query('period') period = '30d') {
    return this.adminService.getAnalytics(period);
  }

  @Get('reports')
  getReports(@Query('type') type = 'users', @Query('range') range = '30d') {
    return this.adminService.getReportData(type, range);
  }

  @Get('users')
  getUsers(@Request() req: any) {
    return this.adminService.getUsers(req.query);
  }

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

  @Get('listings/:id/revision')
  getRevision(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.getAdminPendingRevision(id);
  }

  @Post('listings/:id/revision/approve')
  approveRevision(@Request() req: any, @Param('id') id: string) {
    return this.listingsService.approveRevision(req.user.id, id);
  }

  @Post('listings/:id/revision/reject')
  rejectRevision(
    @Request() req: any,
    @Param('id') id: string,
    @Body() rejectListingDto: RejectListingDto,
  ) {
    return this.listingsService.rejectRevision(req.user.id, id, rejectListingDto);
  }
}
