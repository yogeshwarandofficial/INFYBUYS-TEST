import { PrismaClient, Role } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function findAdmin() {
  const admins = await prisma.user.findMany({
    where: { roles: { has: Role.ADMIN } },
  });
  console.log("Admins:", admins.map(a => ({ id: a.id, email: a.email, name: a.name })));
}
findAdmin().catch(console.error).finally(() => prisma.$disconnect());
