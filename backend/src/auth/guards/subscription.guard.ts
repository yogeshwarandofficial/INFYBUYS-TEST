import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionAudience } from '@prisma/client';
import { REQUIRES_SUBSCRIPTION_KEY } from '../decorators/subscription.decorator.js';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service.js';
import { AuthenticatedUser } from '../types/authenticated-user.type.js';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionsService: SubscriptionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAudience = this.reflector.getAllAndOverride<SubscriptionAudience>(
      REQUIRES_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredAudience) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const hasActiveSub = await this.subscriptionsService.hasActiveSubscription(user.id, requiredAudience);
    if (!hasActiveSub) {
      throw new ForbiddenException('Active subscription required for this feature');
    }

    return true;
  }
}
