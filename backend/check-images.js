const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
  const listings = await prisma.item.findMany({
    where: { name: 'book' },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  
  console.log(JSON.stringify(listings, null, 2));
  await prisma.$disconnect();
}

checkImages();
