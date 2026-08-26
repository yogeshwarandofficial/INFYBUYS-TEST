const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.message.count();
  console.log('Messages count:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
