const identityService = require('./identity.service');

async function initiate(req, res) {
  const { idNumber } = req.body;
  const userId = req.user.userId;

  const result = await identityService.initiateVerification(userId, idNumber);
  res.status(200).json(result);
}

async function verify(req, res) {
  const { idNumber, otp } = req.body;
  const userId = req.user.userId;

  const result = await identityService.verifyIdentity(userId, idNumber, otp);
  res.status(200).json(result);
}

async function getStatus(req, res) {
  const userId = req.user.userId;
  const status = await identityService.getVerificationStatus(userId);
  res.status(200).json({ status: status?.status || 'UNVERIFIED' });
}

module.exports = {
  initiate,
  verify,
  getStatus
};
