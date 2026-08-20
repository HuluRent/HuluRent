import client from './client';

export async function getConversations(params = {}) {
  const { data } = await client.get('/messages/conversations', { params });
  return data;
}

export async function getMessages(bookingId, params = {}) {
  const { data } = await client.get(`/messages/${bookingId}`, { params });
  return data;
}

export async function sendMessage(bookingId, content) {
  const { data } = await client.post(`/messages/${bookingId}`, { content });
  return data;
}
