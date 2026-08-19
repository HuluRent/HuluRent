const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');

function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

function generateRefreshToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};
