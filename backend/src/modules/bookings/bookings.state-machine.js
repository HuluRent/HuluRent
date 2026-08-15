// Single source of truth for legal booking status transitions
// TODO: implement
// 1. Import our custom error handler for validation issues
const { ValidationError } = require('../../shared/errors/ValidationError');

// 2. Define all possible valid transitions according to the tech proposal
const TRANSITIONS = {
  REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  ACCEPTED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['RETURN_PENDING'],
  RETURN_PENDING: ['COMPLETED', 'DISPUTED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
  EXPIRED: [],
  DISPUTED: ['COMPLETED'],
};

// 3. The core function that checks if a move is legal
function transitionBookingState(currentState, newState) {
  // 4. Get the array of allowed next states, or an empty array if none exist
  const allowedNextStates = TRANSITIONS[currentState] || [];

  // 5. If the requested new state is NOT in the allowed list, throw an error
  if (!allowedNextStates.includes(newState)) {
    throw new ValidationError(`Invalid booking state transition from ${currentState} to ${newState}`);
  }

  // 6. If it is allowed, return the new state
  return newState;
}

// 7. Export the function for use in the bookings service
module.exports = {
  transitionBookingState,
};