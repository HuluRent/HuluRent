import client from './client';

/**
 * Fetch conversations belonging to the current user.
 */
export async function getConversations() {
  const response = await client.get('/messaging/conversations');
  return response.data;
}

/**
 * Fetch messages for a conversation.
 */
export async function getMessages(conversationId) {
  const response = await client.get(
    `/messaging/conversations/${conversationId}/messages`
  );
  return response.data;
}

/**
 * Send a message to a conversation.
 */
export async function sendMessage(conversationId, content) {
  const response = await client.post(
    `/messaging/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data;
}
