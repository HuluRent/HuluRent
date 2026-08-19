const { prisma } = require('../../config/database');

async function findUserWithProfile(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });
}

async function updateProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        upsert: {
          create: data,
          update: data
        }
      }
    },
    include: { profile: true }
  });
}

module.exports = {
  findUserWithProfile,
  updateProfile
};
