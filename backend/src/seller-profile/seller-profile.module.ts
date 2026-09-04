import { Module } from '@nestjs/common';
import { SellerProfileController } from './seller-profile.controller.js';
import { SellerProfileService } from './seller-profile.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { S3Module } from '../s3/s3.module.js';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [SellerProfileController],
  providers: [SellerProfileService],
})
export class SellerProfileModule {}
