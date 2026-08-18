const { AppError } = require('./AppError');

class ConflictError extends AppError {
  constructor(message = 'Conflicts with an existing resource') {
    super(message, 409);
  }
}

module.exports = { ConflictError };
