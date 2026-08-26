import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SubscriptionAudience, SubscriptionStatus } from '../../generated/prisma/client.js';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async hasActiveSubscription(userId: string, audience: SubscriptionAudience): Promise<boolean> {
    const activeSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        plan: {
          audience,
        },
        OR: [
          { renewalDate: null },
          { renewalDate: { gte: new Date() } }
        ]
      },
    });

    return !!activeSubscription;
  }

  async getBuyerPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { audience: SubscriptionAudience.BUYER }
    });
  }

  async getMySubscription(userId: string) {
    const activeSub = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return {
      hasActiveSubscription: !!activeSub,
      subscription: activeSub || null,
    };
  }

  async subscribe(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });
    if (!plan) {
      throw new Error('PLAN_NOT_FOUND');
    }
    if (plan.audience !== SubscriptionAudience.BUYER) {
      throw new Error('INVALID_PLAN_AUDIENCE');
    }

    const activeSub = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE
      }
    });
    if (activeSub) {
      throw new Error('ALREADY_SUBSCRIBED');
    }

    const now = new Date();
    const renewalDate = new Date(now);
    if (plan.billingCycle === 'MONTHLY') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    return this.prisma.userSubscription.create({
      data: {
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate: now,
        renewalDate
      },
      include: { plan: true }
    });
  }

  async cancelSubscription(userId: string) {
    const activeSub = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE
      }
    });

    if (!activeSub) {
      throw new Error('NO_ACTIVE_SUBSCRIPTION');
    }

    return this.prisma.userSubscription.update({
      where: { id: activeSub.id },
      data: { status: SubscriptionStatus.CANCELLED }
    });
  }
}
