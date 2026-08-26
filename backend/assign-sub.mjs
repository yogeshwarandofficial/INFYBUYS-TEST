import { PrismaClient, SubscriptionAudience, BillingCycle, SubscriptionStatus } from './dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || 'postgresql://infybuys:infybuys_dev_password@localhost:5433/infybuys';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function assignSubscription() {
  const email = 'buyer@test.com';
  
  // 1. Find the buyer
  const buyer = await prisma.user.findUnique({ where: { email } });
  if (!buyer) {
    console.error(`User ${email} not found.`);
    return;
  }
  
  // 2. Find or create a BUYER SubscriptionPlan
  let plan = await prisma.subscriptionPlan.findFirst({
    where: { audience: SubscriptionAudience.BUYER }
  });
  
  if (!plan) {
    plan = await prisma.subscriptionPlan.create({
      data: {
        name: 'Pro Buyer',
        audience: SubscriptionAudience.BUYER,
        price: 49.99,
        billingCycle: BillingCycle.MONTHLY,
        featureLimits: { searchLimit: 100, contactLimit: 50 }
      }
    });
    console.log(`Created new SubscriptionPlan: ${plan.id}`);
  } else {
    console.log(`Found existing SubscriptionPlan: ${plan.id}`);
  }
  
  // 3. Create or update UserSubscription
  const existingSub = await prisma.userSubscription.findFirst({
    where: { userId: buyer.id, planId: plan.id }
  });
  
  if (existingSub) {
    await prisma.userSubscription.update({
      where: { id: existingSub.id },
      data: { status: SubscriptionStatus.CANCELLED, renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    });
    console.log(`Updated existing subscription to CANCELLED for ${email}`);
  } else {
    await prisma.userSubscription.create({
      data: {
        userId: buyer.id,
        planId: plan.id,
        status: SubscriptionStatus.CANCELLED,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentRef: 'manual_assign_test'
      }
    });
    console.log(`Assigned new CANCELLED subscription to ${email}`);
  }
}

assignSubscription().catch(console.error).finally(() => prisma.$disconnect());
