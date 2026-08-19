const { Router } = require('express');
const controller = require('./notifications.controller');
const authenticate = require('../../shared/middleware/authenticate');

const notificationsRouter = Router();

notificationsRouter.use(authenticate);

notificationsRouter.get('/', controller.list);
notificationsRouter.put('/read-all', controller.markAllRead);
notificationsRouter.put('/:id/read', controller.markRead);

module.exports = { notificationsRouter };
