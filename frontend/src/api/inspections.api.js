import client from './client';

export async function getInspections(bookingId) {
  const { data } = await client.get(`/inspections/${bookingId}`);
  return data;
}

export async function scheduleInspection({ bookingId, scheduledAt, notes }) {
  const { data } = await client.post('/inspections', { bookingId, scheduledAt, notes });
  return data;
}

export async function confirmInspection(id) {
  const { data } = await client.patch(`/inspections/${id}/confirm`);
  return data;
}

export async function cancelInspection(id) {
  const { data } = await client.patch(`/inspections/${id}/cancel`);
  return data;
}

export async function completeInspection(id) {
  const { data } = await client.patch(`/inspections/${id}/complete`);
  return data;
}
