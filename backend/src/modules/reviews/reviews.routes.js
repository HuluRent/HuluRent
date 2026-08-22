const { Router } = require('express');
const controller = require('./reviews.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const asyncHandler = require('../../shared/utils/async-handler');
const { createReviewSchema } = require('./reviews.validation');

const reviewsRouter = Router();

reviewsRouter.post('/', authenticate, validateRequest(createReviewSchema), asyncHandler(controller.create));
reviewsRouter.get('/', asyncHandler(controller.list));

module.exports = { reviewsRouter };
