import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListingsController } from './listings.controller.js';
import { SellerOnboardingController } from './seller-onboarding.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { S3Module } from '../s3/s3.module.js';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module.js';

@Module({
  imports: [PrismaModule, S3Module, SubscriptionsModule],
  controllers: [ListingsController, SellerOnboardingController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
