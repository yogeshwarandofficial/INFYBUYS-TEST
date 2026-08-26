import { SetMetadata } from '@nestjs/common';
import { SubscriptionAudience } from '../../../generated/prisma/client.js';

export const REQUIRES_SUBSCRIPTION_KEY = 'requires_subscription';
export const RequiresSubscription = (audience: SubscriptionAudience) => 
  SetMetadata(REQUIRES_SUBSCRIPTION_KEY, audience);
