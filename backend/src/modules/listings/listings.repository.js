const { prisma } = require('../../config/database');

async function findById(id) {
  const item = await prisma.item.findUnique({
    where: { id },
    select: {
      id: true,
      ownerId: true,
      categoryId: true,
      name: true,
      description: true,
      pricePerUnit: true,
      pricingUnit: true,
      depositAmount: true,
      approxLocation: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      images: {
        orderBy: { position: 'asc' },
      },
      owner: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true
            }
          }
        }
      }
    },
  });

  if (!item) return null;

  return {
    ...item,
    owner: item.owner ? {
      id: item.owner.id,
      displayName: item.owner.profile?.displayName || 'Unknown User',
      avatarUrl: item.owner.profile?.avatarUrl || null,
      rating: 4.8,
      reviewCount: 12,
      isVerified: true
    } : null
  };
}

async function findAll(filters = {}) {
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.ownerId) where.ownerId = filters.ownerId;
  if (filters.status) where.status = filters.status;

  const items = await prisma.item.findMany({
    where,
    select: {
      id: true,
      ownerId: true,
      categoryId: true,
      name: true,
      description: true,
      pricePerUnit: true,
      pricingUnit: true,
      depositAmount: true,
      approxLocation: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      images: {
        orderBy: { position: 'asc' },
        take: 1
      },
      owner: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return items.map(item => ({
    ...item,
    owner: item.owner ? {
      id: item.owner.id,
      displayName: item.owner.profile?.displayName || 'Unknown User',
      avatarUrl: item.owner.profile?.avatarUrl || null,
      rating: 4.8,
      reviewCount: 12,
      isVerified: true
    } : null
  }));
}

async function create(data, imageUrls = []) {
  const { availableFrom, availableTo, ...itemData } = data;

  return prisma.item.create({
    data: {
      ...itemData,
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          position: index
        }))
      },
      // Create the availability window if both dates are provided
      ...(availableFrom && availableTo ? {
        availabilities: {
          create: [{
            startDate: new Date(availableFrom),
            endDate: new Date(availableTo),
          }]
        }
      } : {}),
    },
    include: {
      category: true,
      images: true,
      availabilities: { orderBy: { startDate: 'asc' } },
    }
  });
}

async function update(id, data) {
  return prisma.item.update({
    where: { id },
    data,
    include: {
      category: true,
      images: true,
    }
  });
}

async function remove(id) {
  return prisma.item.delete({
    where: { id }
  });
}

module.exports = {
  findById,
  findAll,
  create,
  update,
  remove
};
