import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminKycService } from './admin-kyc.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/client.js';

@Controller('admin/kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminKycController {
  constructor(private readonly adminKycService: AdminKycService) {}

  @Get()
  getKycApplications() {
    return this.adminKycService.getKycApplications();
  }

  @Get(':sellerId')
  getKycDetails(@Param('sellerId') sellerId: string) {
    return this.adminKycService.getKycDetails(sellerId);
  }

  @Post(':sellerId/approve')
  approveKyc(@Request() req: any, @Param('sellerId') sellerId: string) {
    return this.adminKycService.approveKyc(req.user.id, sellerId);
  }

  @Post(':sellerId/reject')
  rejectKyc(
    @Request() req: any,
    @Param('sellerId') sellerId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminKycService.rejectKyc(req.user.id, sellerId, reason);
  }
}
