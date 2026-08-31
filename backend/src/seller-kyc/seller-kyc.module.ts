import { Module } from '@nestjs/common';
import { SellerKycController } from './seller-kyc.controller.js';
import { SellerKycService } from './seller-kyc.service.js';
import { CompaniesHouseService } from './companies-house.service.js';
import { S3Module } from '../s3/s3.module.js';

@Module({
  imports: [S3Module],
  controllers: [SellerKycController],
  providers: [SellerKycService, CompaniesHouseService],
  exports: [SellerKycService, CompaniesHouseService],
})
export class SellerKycModule {}
