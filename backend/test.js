const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const data = await prisma.listingNdaAcceptance.findMany(); 
  console.log(JSON.stringify(data)); 
} 
main().finally(() => prisma.$disconnect());
