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
    }),
    prisma.item.count({ where })
  ]);

  // Map the nested profile to a flat owner object for the frontend
  const formattedItems = items.map(item => ({
    ...item,
    owner: item.owner ? {
      id: item.owner.id,
      displayName: item.owner.profile?.displayName || 'Unknown User',
      avatarUrl: item.owner.profile?.avatarUrl || null,
      rating: 4.8, // Mock data since rating isn't in schema yet
      reviewCount: 12,
      isVerified: true
    } : null
  }));

  return { items: formattedItems, total };
}

module.exports = {
  findItems
};
