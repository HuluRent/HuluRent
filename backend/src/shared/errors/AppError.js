// Base error class — every other error in shared/errors/ extends this.
// error-handler.js reads .statusCode off whatever it catches; anything
// that isn't an AppError falls back to a generic 500.

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
