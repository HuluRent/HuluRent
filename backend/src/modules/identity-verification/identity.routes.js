const { Router } = require('express');
const controller = require('./identity.controller');
const validateRequest = require('../../shared/middleware/validate-request');
const authenticate = require('../../shared/middleware/authenticate');
const asyncHandler = require('../../shared/utils/async-handler');
const { initiateSchema, verifySchema } = require('./identity.validation');

const identityRouter = Router();

identityRouter.post('/initiate', authenticate, validateRequest(initiateSchema), asyncHandler(controller.initiate));
identityRouter.post('/verify', authenticate, validateRequest(verifySchema), asyncHandler(controller.verify));
identityRouter.get('/status', authenticate, asyncHandler(controller.getStatus));

module.exports = { identityRouter };
