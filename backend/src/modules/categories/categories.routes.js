// Express routes for category listing/management.

const { Router } = require('express');
const controller = require('./categories.controller');
const asyncHandler = require('../../shared/utils/async-handler');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validateRequest = require('../../shared/middleware/validate-request');
const { createCategorySchema, updateCategorySchema } = require('./categories.validation');

const categoriesRouter = Router();

categoriesRouter.get('/', asyncHandler(controller.list));
categoriesRouter.post('/', authenticate, authorize('ADMIN'), validateRequest(createCategorySchema), asyncHandler(controller.create));
categoriesRouter.patch('/:id', authenticate, authorize('ADMIN'), validateRequest(updateCategorySchema), asyncHandler(controller.update));

module.exports = { categoriesRouter };
