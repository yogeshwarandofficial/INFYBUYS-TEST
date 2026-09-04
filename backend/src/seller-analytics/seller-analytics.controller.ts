import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SellerAnalyticsService } from './seller-analytics.service';
import type { Request } from 'express';

@Controller('seller/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SellerAnalyticsController {
  constructor(private readonly sellerAnalyticsService: SellerAnalyticsService) {}

  @Get()
  @Roles('SELLER')
  async getAnalytics(
    @Req() req: Request,
    @Query('period') period?: string,
  ) {
    const sellerId = (req.user as any).id;
    return this.sellerAnalyticsService.getAnalytics(sellerId, period);
  }
}
