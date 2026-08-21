import client from './client';

// GET /api/messaging/conversations
// Returns the list of conversations the current user participates in.
export async function getConversations() {
  const { data } = await client.get('/messaging/conversations');
  return data;
}

// GET /messaging/conversations/:conversationId/messages?page=&limit=
// Returns paginated messages for a single conversation.
export async function getMessages(conversationId, params = {}) {
  const { data } = await client.get(
    `/messaging/conversations/${conversationId}/messages`,
    { params }
  );
  return data;
}

// POST /api/messaging/conversations/:conversationId/messages
// Persists a new message and returns the saved record.
export async function sendMessage(conversationId, content) {
  const { data } = await client.post(
    `/messaging/conversations/${conversationId}/messages`,
    { content }
  );
  return data;
}

export async function startConversation(listingId) {
  const { data } = await client.post('/messaging/conversations', {
    listingId,
  });
  return data;
}
