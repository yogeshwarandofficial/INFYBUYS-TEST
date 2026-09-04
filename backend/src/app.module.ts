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
import { SellerKycModule } from './seller-kyc/seller-kyc.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { SavedSearchesModule } from './saved-searches/saved-searches.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { NdaModule } from './nda/nda.module.js';
import { BuyerProfileModule } from './buyer-profile/buyer-profile.module.js';
import { SellerProfileModule } from './seller-profile/seller-profile.module.js';
import { SellerAnalyticsModule } from './seller-analytics/seller-analytics.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SubscriptionsModule, S3Module, ListingsModule, AdminModule, EnquiriesModule, SellerKycModule, FavoritesModule, SavedSearchesModule, NotificationsModule, NdaModule, BuyerProfileModule, SellerProfileModule, SellerAnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
