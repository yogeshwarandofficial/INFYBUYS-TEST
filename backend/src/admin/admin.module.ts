import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminKycController } from './admin-kyc.controller.js';
import { AdminKycService } from './admin-kyc.service.js';
import { AdminService } from './admin.service.js';
import { ListingsModule } from '../listings/listings.module.js';
import { S3Module } from '../s3/s3.module.js';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ListingsModule, S3Module, PrismaModule, forwardRef(() => NotificationsModule)],
  controllers: [AdminController, AdminKycController],
  providers: [AdminKycService, AdminService],
})
export class AdminModule {}
