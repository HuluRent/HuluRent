const { prisma } = require('../../config/database');

async function findItems(where, skip, take) {
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      skip,
      take,
      include: {
        category: { select: { id: true, name: true } },
        images: {
          orderBy: { position: 'asc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.item.count({ where })
  ]);

  return { items, total };
}

module.exports = {
  findItems
};
