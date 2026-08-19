const { Router } = require('express');

const usersRouter = Router();
const controller = require('./users.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const asyncHandler = require('../../shared/utils/async-handler');
const { updateProfileSchema } = require('./users.validation');

usersRouter.get('/me', authenticate, asyncHandler(controller.getMe));
usersRouter.patch('/me', authenticate, validateRequest(updateProfileSchema), asyncHandler(controller.updateMe));

module.exports = {usersRouter};