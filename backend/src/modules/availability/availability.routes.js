const { Router } = require('express');
const controller = require('./availability.controller');
const asyncHandler = require('../../shared/utils/async-handler');
const authenticate = require('../../shared/middleware/authenticate');

const availabilityRouter = Router();

availabilityRouter.get(
  '/:itemId',
  asyncHandler(controller.getByItemId)
);

availabilityRouter.post(
  '/',
  authenticate,
  asyncHandler(controller.create)
);

availabilityRouter.delete(
  '/:id',
  authenticate,
  asyncHandler(controller.remove)
);

module.exports = { availabilityRouter };
