const { Router } = require('express');

const controller = require('./messaging.controller');
const {
  sendMessageSchema,
  messagePaginationSchema,
  startConversationSchema,
} = require('./messaging.validation');

const authenticate = require('../../shared/middleware/authenticate');
const validateRequest = require('../../shared/middleware/validate-request');
const validateQuery = require('./messaging.query-validation');
const asyncHandler = require('../../shared/utils/async-handler');

const messagingRouter = Router();

messagingRouter.get(
  '/conversations',
  authenticate,
  asyncHandler(controller.listConversations)
);

messagingRouter.get(
  '/conversations/:conversationId/messages',
  authenticate,
  validateQuery(messagePaginationSchema),
  asyncHandler(controller.listMessages)
);

messagingRouter.post(
  '/conversations/:conversationId/messages',
  authenticate,
  validateRequest(sendMessageSchema),
  asyncHandler(controller.createMessage)
);

messagingRouter.post(
  '/conversations',
  authenticate,
  validateRequest(startConversationSchema),
  asyncHandler(controller.startConversation)
);

module.exports = { messagingRouter };
