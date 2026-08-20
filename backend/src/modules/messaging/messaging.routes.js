const { Router } = require('express');

const controller = require('./messaging.controller');
const {
  sendMessageSchema,
  messagePaginationSchema,
} = require('./messaging.validation');

const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const validateQuery = require('./messaging.query-validation');

const messagingRouter = Router();

messagingRouter.get(
  '/conversations',
  authenticate,
  controller.listConversations
);

messagingRouter.get(
  '/conversations/:conversationId/messages',
  authenticate,
  validateQuery(messagePaginationSchema),
  controller.listMessages
);

messagingRouter.post(
  '/conversations/:conversationId/messages',
  authenticate,
  validateRequest(sendMessageSchema),
  controller.createMessage
);

module.exports = { messagingRouter };
