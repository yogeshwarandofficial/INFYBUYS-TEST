import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { ListingsModule } from '../listings/listings.module.js';

@Module({
  imports: [ListingsModule],
  controllers: [AdminController],
})
export class AdminModule {}
