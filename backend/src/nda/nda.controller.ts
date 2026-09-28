import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { NdaService } from './nda.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NdaController {
  constructor(private readonly ndaService: NdaService) {}

  @Roles(Role.BUYER)
  @Post('listings/:listingId/nda/request')
  async requestNda(@Request() req: any, @Param('listingId') listingId: string) {
    return this.ndaService.requestNda(req.user.id, listingId);
  }

  @Roles(Role.BUYER)
  @Post('listings/:listingId/nda/sign')
  async signNda(@Request() req: any, @Param('listingId') listingId: string) {
    return this.ndaService.signNda(req.user.id, listingId);
  }

  @Roles(Role.BUYER)
  @Get('listings/:listingId/nda/status')
  async getNdaStatus(@Request() req: any, @Param('listingId') listingId: string) {
    return this.ndaService.getNdaStatusForBuyer(req.user.id, listingId);
  }

  @Roles(Role.BUYER)
  @Get('nda/me')
  async getMyNdas(@Request() req: any) {
    return this.ndaService.getAllNdasForBuyer(req.user.id);
  }

  @Roles(Role.SELLER)
  @Get('seller/nda')
  async getSellerNdas(@Request() req: any) {
    return this.ndaService.getAllNdasForSeller(req.user.id);
  }
}
