// Reads and validates process.env. Require this instead of reading
// process.env directly, so a missing required var fails loudly at
// startup instead of silently as `undefined` deep in a request handler.

require('dotenv').config();

function requireEnv(key, fallback) {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}. Did you copy .env.example to .env?`
    );
  }
  return value;
}

const env = {
  port: Number(requireEnv('PORT', '3000')),
  nodeEnv: requireEnv('NODE_ENV', 'development'),
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  frontendOrigin: requireEnv('FRONTEND_ORIGIN', 'http://localhost:5173'),
  mockFaydaUrl: requireEnv('MOCK_FAYDA_URL', 'http://localhost:8888'),
};

module.exports = { env };
