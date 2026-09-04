import { Module } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service.js';
import { SavedSearchesController } from './saved-searches.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SavedSearchesController],
  providers: [SavedSearchesService],
  exports: [SavedSearchesService],
})
export class SavedSearchesModule {}
