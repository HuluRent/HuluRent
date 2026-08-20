import client from './client';

export async function getMyProfile() {
  const response = await client.get('/users/me');
  return response.data;
}

export function getUserProfile(id) {
  return client.get(`/users/${id}`).then((res) => res.data);
}

export async function updateMyProfile(changedFields) {
  const response = await client.patch('/users/me', changedFields);
  return response.data;
}
