const { ForbiddenError } = require('../errors/ForbiddenError');
const { prisma } = require('../../config/database');

async function requireVerifiedUser(req, res, next) {
  if (!req.user || !req.user.userId) {
    return next(new ForbiddenError('Authentication required'));
  }

  try {
    const identity = await prisma.identityVerification.findUnique({
      where: { userId: req.user.userId }
    });

    if (!identity || identity.status !== 'VERIFIED') {
      return next(new ForbiddenError('Verify your identity first to continue.'));
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireVerifiedUser;
