// Used for booking overlap — both the app-level conflict check
// (bookings.conflict-check.js) and a caught Postgres exclusion_violation
// (the DB-level backstop) should throw/translate to this same error,
// so the API response is consistent regardless of which layer caught it.
// See hulurent-docs' ARCHITECTURE.md §3.

const { AppError } = require('./AppError');

class ConflictError extends AppError {
  constructor(message = 'Conflicts with an existing resource') {
    super(message, 409);
  }
}

module.exports = { ConflictError };
