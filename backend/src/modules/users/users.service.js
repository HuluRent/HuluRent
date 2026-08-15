
const repo = require('./users.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

exports.getProfile = async (userId) => {
  const user = await repo.findUserWithProfile(userId);
  if (!user) throw new NotFoundError('User not found');
  const { password, ...safeUser } = user;
  return safeUser;
};

exports.updateProfile = async (userId, data) => repo.updateProfile(userId, data);