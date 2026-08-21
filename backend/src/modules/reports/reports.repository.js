const { prisma } = require('../../config/database');

async function create(data) {
  return prisma.report.create({
    data,
    include: {
      author: { select: { id: true, email: true } },
      subject: { select: { id: true, email: true } }
    }
  });
}

async function findById(id) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, email: true } },
      subject: { select: { id: true, email: true } }
    }
  });
}

async function findAll(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.authorId) where.authorId = filters.authorId;

  return prisma.report.findMany({
    where,
    include: {
      author: { select: { id: true, email: true } },
      subject: { select: { id: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function updateStatus(id, status, resolvedAt) {
  return prisma.report.update({
    where: { id },
    data: { status, resolvedAt },
    include: {
      author: { select: { id: true, email: true } },
      subject: { select: { id: true, email: true } }
    }
  });
}

module.exports = {
  create,
  findById,
  findAll,
  updateStatus
};
