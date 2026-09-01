import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = await prisma.user.findMany({
    where: { roles: { has: 'ADMIN' } }
  });
  
  if (admins.length > 0) {
    console.log('Found admins:', admins.map(a => a.email));
    
    // Reset password for the first admin
    const admin = admins[0];
    const newPassword = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: hashedPassword }
    });
    
    console.log(`Password reset for ${admin.email}. New password: ${newPassword}`);
  } else {
    console.log('No admins found. Creating one...');
    const email = 'admin@infybuys.com';
    const newPassword = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        roles: ['ADMIN', 'BUYER'],
        name: 'Admin User'
      }
    });
    console.log(`Admin created. Email: ${email}, Password: ${newPassword}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
