import client from './client';

export async function uploadEvidence(formData) {
  const { data } = await client.post('/evidence', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getEvidence(bookingId) {
  const { data } = await client.get(`/evidence/${bookingId}`);
  return data;
}

export async function acknowledgeEvidence(id) {
  const { data } = await client.patch(`/evidence/${id}/acknowledge`);
  return data;
}
