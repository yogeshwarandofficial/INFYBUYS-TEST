import { PrismaClient, Role } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function findAdmin() {
  const admins = await prisma.user.findMany({
    where: { roles: { has: Role.ADMIN } },
  });
  console.log("Admins:", admins.map(a => ({ id: a.id, email: a.email, name: a.name })));
}
findAdmin().catch(console.error).finally(() => prisma.$disconnect());
