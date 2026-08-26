import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post('listings/:id/enquiries')
  @Roles('BUYER')
  createEnquiry(@Param('id') listingId: string, @Request() req, @Body() dto: CreateEnquiryDto) {
    return this.enquiriesService.createEnquiry(listingId, req.user.id, dto);
  }

  @Get('enquiries/me')
  @Roles('BUYER')
  getBuyerEnquiries(@Request() req) {
    return this.enquiriesService.getBuyerEnquiries(req.user.id);
  }

  @Get('seller/enquiries')
  @Roles('SELLER')
  getSellerEnquiries(@Request() req) {
    return this.enquiriesService.getSellerEnquiries(req.user.id);
  }

  @Get('enquiries/:id')
  getEnquiry(@Param('id') id: string, @Request() req) {
    return this.enquiriesService.getEnquiry(id, req.user.id);
  }

  @Post('enquiries/:id/messages')
  sendMessage(@Param('id') id: string, @Request() req, @Body() dto: SendMessageDto) {
    return this.enquiriesService.sendMessage(id, req.user.id, dto);
  }

  @Patch('enquiries/:id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.enquiriesService.markRead(id, req.user.id);
  }
}
