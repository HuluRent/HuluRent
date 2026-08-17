// 1. Import our custom error classes
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

/**
 * 2. The middleware factory function.
 * We pass in a function (getOwnerIdFn) that knows how to query the database
 * for a specific resource's owner ID.
 */
const ownershipGuard = (getOwnerIdFn) => {
  
  // 3. Return the actual Express middleware function
  return async (req, res, next) => {
    try {
      // 4. Extract the IDs we need to compare
      const resourceId = req.params.id;
      const userId = req.user.id; // Populated earlier by the authenticate middleware

      // 5. Ask the database who owns this specific resource
      const ownerId = await getOwnerIdFn(resourceId);

      // 6. If the resource doesn't exist at all, return a 404
      if (!ownerId) {
        throw new NotFoundError('Resource not found');
      }

      // 7. Check if the logged-in user matches the owner (or is an admin)
      if (ownerId !== userId && req.user.role !== 'ADMIN') {
        throw new ForbiddenError('You are not authorized to modify this resource');
      }

      // 8. If they match, allow the request to proceed to the controller!
      next();
    } catch (error) {
      // 9. Pass any errors to the error-handler we built earlier
      next(error);
    }
  };
};

module.exports = ownershipGuard;