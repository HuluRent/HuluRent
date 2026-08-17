const { Router } = require('express');
const controller = require('./auth.controller');
const validateRequest = require('../../shared/middleware/validate-request');
const authenticate = require('../../shared/middleware/authenticate');
const asyncHandler = require('../../shared/utils/async-handler');
const { registerSchema, loginSchema } = require('./auth.validation');
const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), asyncHandler(controller.register));
authRouter.post('/login', validateRequest(loginSchema), asyncHandler(controller.login));
authRouter.post('/logout', authenticate, asyncHandler(controller.logout));

module.exports = {authRouter};