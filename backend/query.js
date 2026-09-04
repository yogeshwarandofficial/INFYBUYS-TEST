const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const listing = await prisma.listing.findFirst({ where: { title: { contains: 'hello' } } });
  console.log(listing);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
