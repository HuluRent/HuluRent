import client from './client';

export async function getIdentityVerificationStatus() {
  const { data } = await client.get('/identity/status');
  return data;
}

export async function initiateIdentityVerification(idNumber) {
  const { data } = await client.post('/identity/initiate', { idNumber });
  return data;
}

export async function verifyIdentity(idNumber, otp) {
  const { data } = await client.post('/identity/verify', { idNumber, otp });
  return data;
}
