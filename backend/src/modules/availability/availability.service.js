const { prisma } = require('../../config/database');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ConflictError } = require('../../shared/errors/ConflictError');

async function getByItemId(itemId) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true },
  });

  if (!item) {
    throw new NotFoundError('Listing not found');
  }

  return prisma.availability.findMany({
    where: { itemId },
    orderBy: { startDate: 'asc' },
  });
}

async function create(itemId, startDate, endDate) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true },
  });

  if (!item) {
    throw new NotFoundError('Listing not found');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid availability dates');
  }

  if (start >= end) {
    throw new Error('startDate must be before endDate');
  }

  const overlapping = await prisma.availability.findFirst({
    where: {
      itemId,
      startDate: { lt: end },
      endDate: { gt: start },
    },
  });

  if (overlapping) {
    throw new ConflictError('Availability window overlaps an existing window');
  }

  return prisma.availability.create({
    data: {
      itemId,
      startDate: start,
      endDate: end,
    },
  });
}

async function remove(id) {
  const availability = await prisma.availability.findUnique({
    where: { id },
  });

  if (!availability) {
    throw new NotFoundError('Availability not found');
  }

  return prisma.availability.delete({
    where: { id },
  });
}

module.exports = {
  getByItemId,
  create,
  remove,
};
