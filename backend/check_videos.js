const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.listingMedia.findMany({
    where: { type: 'VIDEO' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, url: true, s3Key: true, createdAt: true, listingId: true }
  });
  console.log(JSON.stringify(videos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
