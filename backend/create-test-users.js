import { PrismaClient, Role } from './dist/generated/prisma/client.js';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createTestUsers() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create a Seller
  const sellerEmail = 'seller@test.com';
  let seller = await prisma.user.findUnique({ where: { email: sellerEmail } });
  if (!seller) {
    seller = await prisma.user.create({
      data: {
        name: 'Test Seller',
        email: sellerEmail,
        passwordHash,
        roles: [Role.SELLER],
      },
    });
    console.log(`✅ Created Seller: ${sellerEmail} (Password: password123)`);
  } else {
    await prisma.user.update({
      where: { email: sellerEmail },
      data: { roles: [Role.SELLER] }
    });
    console.log(`✅ Updated existing user ${sellerEmail} to SELLER`);
  }

  // 2. Create an Admin
  const adminEmail = 'admin@test.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: adminEmail,
        passwordHash,
        roles: [Role.ADMIN],
      },
    });
    console.log(`✅ Created Admin: ${adminEmail} (Password: password123)`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { roles: [Role.ADMIN] }
    });
    console.log(`✅ Updated existing user ${adminEmail} to ADMIN`);
  }

  await prisma.$disconnect();
}

createTestUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
