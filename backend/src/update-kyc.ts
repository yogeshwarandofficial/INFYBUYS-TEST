import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  await prisma.sellerProfile.updateMany({
    data: {
      kycStatus: 'APPROVED'
    }
  });
  console.log('Successfully updated existing seller profiles to KYC APPROVED.');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
