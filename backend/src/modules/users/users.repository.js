const prisma = require('../../config/database');

exports.findUserWithProfile = (userId) =>
  prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });

exports.updateProfile = (userId, data) =>
  prisma.profile.update({ where: { userId }, data });