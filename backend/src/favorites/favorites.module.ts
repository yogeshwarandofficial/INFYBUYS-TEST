import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller.js';
import { FavoritesService } from './favorites.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ListingsModule } from '../listings/listings.module.js';

@Module({
  imports: [PrismaModule, ListingsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
