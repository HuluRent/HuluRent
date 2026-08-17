// Central Express error handler — must be the last middleware registered.
// Maps AppError subclasses to their statusCode; anything else (a bug,
// an unhandled Prisma error) falls back to a generic 500 and gets logged
// so it's not silently swallowed.

const { AppError } = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}

module.exports = { errorHandler };
