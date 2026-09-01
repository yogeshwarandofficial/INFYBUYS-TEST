import { PrismaClient } from './dist/generated/prisma/client.js';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || 'postgresql://infybuys:infybuys_dev_password@localhost:5433/infybuys';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetPassword() {
  const email = 'buyer@test.com';
  const newPassword = 'password123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.updateMany({
    where: { email },
    data: { passwordHash: hashedPassword }
  });
  console.log(`Password for ${email} has been reset to: ${newPassword}`);
}

resetPassword().catch(console.error).finally(() => prisma.$disconnect());
