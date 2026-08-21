const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

const ownershipGuard = (getOwnerIdFn) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.userId;

      const ownerId = await getOwnerIdFn(resourceId);

      if (!ownerId) {
        throw new NotFoundError('Resource not found');
      }

      const isAuthorized = Array.isArray(ownerId) 
        ? ownerId.includes(userId) 
        : ownerId === userId;

      if (!isAuthorized && req.user.role !== 'ADMIN') {
        throw new ForbiddenError('You are not authorized to modify this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = ownershipGuard;