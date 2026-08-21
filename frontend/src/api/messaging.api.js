import client from './client';

// GET /api/messaging/conversations
// Returns the list of conversations the current user participates in.
export async function getConversations() {
  const { data } = await client.get('/api/messaging/conversations');
  return data;
}

// GET /api/messaging/conversations/:conversationId/messages?page=&limit=
// Returns paginated messages for a single conversation.
export async function getMessages(conversationId, params = {}) {
  const { data } = await client.get(
    `/api/messaging/conversations/${conversationId}/messages`,
    { params }
  );
  return data;
}

// POST /api/messaging/conversations/:conversationId/messages
// Persists a new message and returns the saved record.
export async function sendMessage(conversationId, content) {
  const { data } = await client.post(
    `/api/messaging/conversations/${conversationId}/messages`,
    { content }
  );
  return data;
}
