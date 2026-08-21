const { Router } = require('express');
const controller = require('./reviews.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const { createReviewSchema } = require('./reviews.validation');

const reviewsRouter = Router();

reviewsRouter.post('/', authenticate, validateRequest(createReviewSchema), controller.create);
reviewsRouter.get('/', controller.list);

module.exports = { reviewsRouter };
