import 'dotenv/config';
import { PrismaClient, Role } from '../generated/prisma/client.js';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to seed the admin user.');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      roles: [Role.ADMIN, Role.BUYER],
    },
    create: {
      email,
      passwordHash: hashedPassword,
      roles: [Role.ADMIN, Role.BUYER],
      name: 'Admin User',
    },
  });

  console.log(`Admin user seeded successfully: ${admin.email}`);

  // Seed Development Buyer Subscription Plans
  const buyerMonthly = await prisma.subscriptionPlan.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      audience: 'BUYER',
      name: 'Buyer Monthly',
      price: 29.99,
      billingCycle: 'MONTHLY',
      featureLimits: {
        savedSearches: 100,
        enquiries: 50,
        ndaAccess: true,
        messaging: true
      }
    }
  });

  const buyerAnnual = await prisma.subscriptionPlan.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      audience: 'BUYER',
      name: 'Buyer Annual',
      price: 299.99,
      billingCycle: 'ANNUAL',
      featureLimits: {
        savedSearches: -1,
        enquiries: -1,
        ndaAccess: true,
        messaging: true
      }
    }
  });

  console.log(`Buyer plans seeded successfully: ${buyerMonthly.name}, ${buyerAnnual.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
