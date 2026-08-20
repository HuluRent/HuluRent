import client from './client';

export async function getNotifications(params = {}) {
  const { data } = await client.get('/notifications', { params });
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await client.patch(`/notifications/${id}/read`);
  return data;
}
