import 'dotenv/config';
import { PrismaClient } from './dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function check() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findFirst();
  console.log('User passwordHash:', user.passwordHash);
  process.exit(0);
}
check();
