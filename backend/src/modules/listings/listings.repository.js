const { prisma } = require('../../config/database');

async function findById(id) {
  return prisma.item.findUnique({
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
    },
  });
}

async function findAll(filters = {}) {
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.ownerId) where.ownerId = filters.ownerId;
  if (filters.status) where.status = filters.status;

  return prisma.item.findMany({
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
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function create(data, imageUrls = []) {
  return prisma.item.create({
    data: {
      ...data,
      images: {
        create: imageUrls.map((url, index) => ({
          url,
          position: index
        }))
      }
    },
    include: {
      category: true,
      images: true,
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
