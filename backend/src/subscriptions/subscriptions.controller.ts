import { Controller, Get, Post, Body, UseGuards, Request, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { CreateSubscriptionDto } from './dto/subscribe.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getBuyerPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMySubscription(@Request() req: any) {
    return this.subscriptionsService.getMySubscription(req.user.id);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  async subscribe(@Request() req: any, @Body() dto: CreateSubscriptionDto) {
    try {
      return await this.subscriptionsService.subscribe(req.user.id, dto.planId);
    } catch (error: any) {
      if (error.message === 'PLAN_NOT_FOUND') {
        throw new NotFoundException('Subscription plan not found');
      }
      if (error.message === 'INVALID_PLAN_AUDIENCE') {
        throw new BadRequestException('Plan is not valid for buyers');
      }
      if (error.message === 'ALREADY_SUBSCRIBED') {
        throw new ConflictException('You already have an active subscription');
      }
      throw error;
    }
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Request() req: any) {
    try {
      return await this.subscriptionsService.cancelSubscription(req.user.id);
    } catch (error: any) {
      if (error.message === 'NO_ACTIVE_SUBSCRIPTION') {
        throw new NotFoundException('No active subscription found to cancel');
      }
      throw error;
    }
  }
}
