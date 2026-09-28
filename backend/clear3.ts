import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.enquiryMessage.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listingMedia.deleteMany();
  await prisma.listingRevision.deleteMany();
  await prisma.listingView.deleteMany();
  await prisma.ndaAgreement.deleteMany();
  await prisma.review.deleteMany();
  const result = await prisma.listing.deleteMany();
  console.log('Deleted ' + result.count + ' listings.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
