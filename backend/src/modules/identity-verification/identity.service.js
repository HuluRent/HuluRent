const identityRepo = require('./identity.repository');
const usersRepo = require('../users/users.repository');
const { env } = require('../../config/env');

const MOCK_FAYDA_URL = env.mockFaydaUrl;

async function initiateVerification(userId, idNumber) {
  const user = await usersRepo.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Call Mock Fayda to initiate OTP
  const response = await fetch(`${MOCK_FAYDA_URL}/mock-fayda/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      idNumber,
      email: user.email
    })
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to initiate verification with Mock Fayda');
  }

  // Upsert the identity verification record to PENDING
  await identityRepo.upsertVerification(userId, {
    status: 'PENDING',
    provider: 'MockFayda',
    reference: idNumber
  });

  return { message: 'Verification initiated successfully.', otp: responseData.otp };
}

async function verifyIdentity(userId, idNumber, otp) {
  // Check if there is a pending verification
  const verification = await identityRepo.findVerificationByUserId(userId);
  if (!verification || verification.status !== 'PENDING') {
    throw new Error('No pending verification found');
  }

  if (verification.reference !== idNumber) {
    throw new Error('ID number does not match the pending verification');
  }

  // Call Mock Fayda to verify OTP
  const response = await fetch(`${MOCK_FAYDA_URL}/mock-fayda/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      idNumber,
      otp
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to verify OTP with Mock Fayda');
  }

  // Successfully verified, update the verification record
  await identityRepo.upsertVerification(userId, {
    status: 'VERIFIED',
    verifiedAt: new Date()
  });

  // (Optional: In the future, we could update the user's profile with the Mock Fayda data returned here)
  // const { profile } = await response.json();

  return { message: 'Identity verified successfully' };
}

async function getVerificationStatus(userId) {
  return identityRepo.findVerificationByUserId(userId);
}

module.exports = {
  initiateVerification,
  verifyIdentity,
  getVerificationStatus
};
