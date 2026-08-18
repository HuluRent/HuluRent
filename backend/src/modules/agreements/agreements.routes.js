// Express routes for rental agreement view/accept.
// TODO: add real route handlers — wire middleware (authenticate, authorize,
// ownershipGuard, validateRequest) in order, then delegate to the controller.

const { Router } = require('express');

const agreementsRouter = Router();

// Example shape once implemented:
// router.get('/', asyncHandler(controller.list));
// router.post('/', authenticate, validateRequest(schema), asyncHandler(controller.create));

module.exports = { agreementsRouter };
