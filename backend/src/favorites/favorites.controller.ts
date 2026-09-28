import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  getBuyerFavorites(@Request() req: any) {
    return this.favoritesService.getBuyerFavorites(req.user.id);
  }

  @Post(':listingId')
  addFavorite(@Request() req: any, @Param('listingId') listingId: string) {
    return this.favoritesService.addFavorite(req.user.id, listingId);
  }

  @Delete(':listingId')
  removeFavorite(@Request() req: any, @Param('listingId') listingId: string) {
    return this.favoritesService.removeFavorite(req.user.id, listingId);
  }
}
