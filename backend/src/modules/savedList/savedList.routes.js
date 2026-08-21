const { Router } = require('express');
const controller = require('./savedList.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const asyncHandler = require('../../shared/utils/async-handler');
const { addSavedListingSchema } = require('./savedList.validation');

const savedListRouter = Router();

// All routes require authentication
savedListRouter.get('/', authenticate, asyncHandler(controller.list));

savedListRouter.post(
  '/',
  authenticate,
  validateRequest(addSavedListingSchema),
  asyncHandler(controller.add)
);

savedListRouter.delete('/:listingId', authenticate, asyncHandler(controller.remove));

module.exports = { savedListRouter };
