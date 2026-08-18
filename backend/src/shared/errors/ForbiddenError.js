const { AppError } = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message = 'Not allowed to perform this action') {
    super(message, 403);
  }
}

module.exports = { ForbiddenError };
