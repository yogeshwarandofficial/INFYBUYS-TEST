import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const media = await prisma.listingMedia.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      listing: {
        select: {
          title: true,
          status: true
        }
      }
    }
  });

  console.log(JSON.stringify(media, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
