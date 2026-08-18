const { prisma } = require('../../config/database');

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });
}

module.exports = {
  findById
};
