import pkg from './generated/prisma/client.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
prisma.sellerProfile.updateMany({ data: { kycStatus: 'NOT_STARTED' } })
  .then(res => console.log('Reset:', res))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
