import client from './client';

export async function getAgreement(bookingId) {
  const { data } = await client.get(`/agreements/${bookingId}`);
  return data;
}

export async function acceptAgreement(bookingId) {
  const { data } = await client.post(`/agreements/${bookingId}/accept`);
  return data;
}
