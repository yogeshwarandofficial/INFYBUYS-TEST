import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { SellerKycService } from './seller-kyc.service.js';
import { SubmitKycDto } from './dto/submit-kyc.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, KycDocumentType } from '../../generated/prisma/client.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('seller/kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER, Role.BUYER)
export class SellerKycController {
  constructor(private readonly sellerKycService: SellerKycService) {}

  @Get()
  getKycStatus(@Request() req: any) {
    return this.sellerKycService.getKycStatus(req.user.id);
  }

  @Post()
  submitKyc(@Request() req: any, @Body() dto: SubmitKycDto) {
    return this.sellerKycService.submitKyc(req.user.id, dto);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Request() req: any,
    @Body('documentType') documentType: KycDocumentType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    ) file: Express.Multer.File
  ) {
    return this.sellerKycService.uploadDocument(req.user.id, file, documentType);
  }

  @Delete('documents/:id')
  deleteDocument(@Request() req: any, @Param('id') documentId: string) {
    return this.sellerKycService.deleteDocument(req.user.id, documentId);
  }

  @Get('company-lookup/:companyNumber')
  lookupCompany(@Param('companyNumber') companyNumber: string) {
    return this.sellerKycService.lookupCompany(companyNumber);
  }
}
