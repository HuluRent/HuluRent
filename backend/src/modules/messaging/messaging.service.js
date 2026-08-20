const repository = require('./messaging.repository');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function getPagination(page, limit) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : DEFAULT_PAGE;

  const currentLimit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
}

async function getConversations(userId) {
  return repository.findConversationsByUserId(userId);
}

async function getMessages(conversationId, userId, page, limit) {
  const conversation = await repository.findConversationById(conversationId);

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.userId === userId
  );

  if (!isParticipant) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  const pagination = getPagination(page, limit);

  const [messages, total] = await Promise.all([
    repository.findMessages(
      conversationId,
      pagination.skip,
      pagination.limit
    ),
    repository.countMessages(conversationId),
  ]);

  return {
    messages,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

async function sendMessage(conversationId, userId, content) {
  const conversation = await repository.findConversationById(conversationId);

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.userId === userId
  );

  if (!isParticipant) {
    throw new ForbiddenError('You are not a participant in this conversation');
  }

  return repository.createMessage({
    conversationId,
    senderId: userId,
    content,
  });
}

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
};
