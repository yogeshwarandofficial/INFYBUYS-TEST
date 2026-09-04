import { Module } from '@nestjs/common';
import { BuyerProfileController } from './buyer-profile.controller.js';
import { BuyerProfileService } from './buyer-profile.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { S3Module } from '../s3/s3.module.js';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [BuyerProfileController],
  providers: [BuyerProfileService],
})
export class BuyerProfileModule {}
