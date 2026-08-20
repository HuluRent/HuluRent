const service = require('./messaging.service');
const asyncHandler = require('../../shared/utils/async-handler');

const listConversations = asyncHandler(async (req, res) => {
  const conversations = await service.getConversations(req.user.userId);

  return res.json({
    success: true,
    data: conversations,
  });
});

const listMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page, limit } = req.query;

  const result = await service.getMessages(
    conversationId,
    req.user.userId,
    page,
    limit
  );

  return res.json({
    success: true,
    data: result,
  });
});

const createMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;

  const message = await service.sendMessage(
    conversationId,
    req.user.userId,
    content
  );

  return res.status(201).json({
    success: true,
    data: message,
  });
});

module.exports = {
  listConversations,
  listMessages,
  createMessage,
};
