// CORS configuration — allows requests from hulurent-frontend only.

const { env } = require('./env');

const corsOptions = {
  origin: env.frontendOrigin,
  credentials: true,
};

module.exports = { corsOptions };
