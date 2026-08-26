import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';
import { S3Module } from './s3/s3.module.js';
import { ListingsModule } from './listings/listings.module.js';
import { AdminModule } from './admin/admin.module.js';
import { EnquiriesModule } from './enquiries/enquiries.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SubscriptionsModule, S3Module, ListingsModule, AdminModule, EnquiriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
