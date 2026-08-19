
const repo = require('./users.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

exports.getProfile = async (userId) => {
  const user = await repo.findUserWithProfile(userId);
  if (!user) throw new NotFoundError('User not found');
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

exports.getPublicProfile = async (userId) => {
  const user = await repo.findUserWithProfile(userId);
  if (!user) throw new NotFoundError('User not found');
  
  // Strip out sensitive fields (adjust these based on your schema)
  const { passwordHash, email, phone, ...safeUser } = user;
  return safeUser;
};

exports.updateProfile = async (userId, data) => repo.updateProfile(userId, data);