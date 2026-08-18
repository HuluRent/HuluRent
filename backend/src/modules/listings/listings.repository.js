const { prisma } = require('../../config/database');

async function findById(id) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { position: 'asc' },
      },
    },
  });
}

module.exports = {
  findById,
};
