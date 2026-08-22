const { Router } = require('express');
const controller = require('./notifications.controller');
const authenticate = require('../../shared/middleware/authenticate');
const asyncHandler = require('../../shared/utils/async-handler');

const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', authenticate, asyncHandler(controller.list));
notificationsRouter.put('/read-all', authenticate, asyncHandler(controller.markAllRead));
notificationsRouter.put('/:id/read', authenticate, asyncHandler(controller.markRead));

module.exports = { notificationsRouter };
