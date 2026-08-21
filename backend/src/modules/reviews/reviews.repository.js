const { prisma } = require('../../config/database');

async function create(data) {
  return prisma.review.create({
    data,
    include: {
      author: {
        select: { id: true, email: true, role: true }
      }
    }
  });
}

async function findBySubjectId(subjectId) {
  return prisma.review.findMany({
    where: { subjectId },
    include: {
      author: {
        select: { id: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function findByBookingId(bookingId) {
  return prisma.review.findMany({
    where: { bookingId },
    include: {
      author: {
        select: { id: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function getAverageRating(subjectId) {
  const result = await prisma.review.aggregate({
    where: { subjectId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  return {
    average: result._avg.rating || 0,
    count: result._count.rating
  };
}

module.exports = {
  create,
  findBySubjectId,
  findByBookingId,
  getAverageRating
};
