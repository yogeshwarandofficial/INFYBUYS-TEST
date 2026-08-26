const { PrismaClient } = require('./generated/prisma/client.js');
const prisma = new PrismaClient();
prisma.refreshToken.deleteMany().then(() => console.log('deleted')).catch(console.error).finally(() => prisma.$disconnect());
