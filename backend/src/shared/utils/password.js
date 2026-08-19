const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(plainTextPassword) {
  return bcrypt.hash(plainTextPassword, saltRounds);
}

async function verifyPassword(plainTextPassword, hash) {
  return bcrypt.compare(plainTextPassword, hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
