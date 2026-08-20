import client from './client';

export async function submitReport({ subjectId, reason, details }) {
  const { data } = await client.post('/reports', { subjectId, reason, details });
  return data;
}
