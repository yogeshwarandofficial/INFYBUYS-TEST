import { SetMetadata } from '@nestjs/common';
import { SubscriptionAudience } from '@prisma/client';

export const REQUIRES_SUBSCRIPTION_KEY = 'requires_subscription';
export const RequiresSubscription = (audience: SubscriptionAudience) => 
  SetMetadata(REQUIRES_SUBSCRIPTION_KEY, audience);
