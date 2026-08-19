const { prisma } = require('../../config/database');

async function create(userId, type, payload) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      payload
    }
  });
}

async function findByUserId(userId, unreadOnly = false) {
  const where = { userId };
  if (unreadOnly) {
    where.readAt = null;
  }
  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

async function markAsRead(id, userId) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() }
  });
}

async function markAllAsRead(userId) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() }
  });
}

module.exports = {
  create,
  findByUserId,
  markAsRead,
  markAllAsRead
};
