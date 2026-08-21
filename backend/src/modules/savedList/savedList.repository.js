const { prisma } = require('../../config/database');

async function findAllByUser(userId) {
  return prisma.savedListing.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        select: {
          id: true,
          name: true,
          description: true,
          pricePerUnit: true,
          pricingUnit: true,
          depositAmount: true,
          approxLocation: true,
          status: true,
          category: { select: { id: true, name: true, slug: true } },
          images: {
            orderBy: { position: 'asc' },
            take: 1,
            select: { url: true, position: true },
          },
        },
      },
    },
  });
}

async function exists(userId, listingId) {
  const entry = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId, listingId } },
    select: { id: true },
  });
  return entry !== null;
}

async function create(userId, listingId) {
  return prisma.savedListing.create({
    data: { userId, listingId },
  });
}

async function remove(userId, listingId) {
  return prisma.savedListing.delete({
    where: { userId_listingId: { userId, listingId } },
  });
}

module.exports = { findAllByUser, exists, create, remove };
