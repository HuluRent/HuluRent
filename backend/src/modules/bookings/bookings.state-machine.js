// Single source of truth for legal booking status transitions

const { ValidationError } = require('../../shared/errors/ValidationError');

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

function transitionBookingState(currentState, newState) {
  const allowedNextStates = TRANSITIONS[currentState] || [];

  if (!allowedNextStates.includes(newState)) {
    throw new ValidationError(`Invalid booking state transition from ${currentState} to ${newState}`);
  }

  return newState;
}

module.exports = {
  transitionBookingState,
};