const { prisma } = require('../../config/database');

async function upsertVerification(userId, data) {
  return prisma.identityVerification.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data
    }
  });
}

async function findVerificationByUserId(userId) {
  return prisma.identityVerification.findUnique({
    where: { userId }
  });
}

module.exports = {
  upsertVerification,
  findVerificationByUserId
};
