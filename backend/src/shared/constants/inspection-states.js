// Inspection lifecycle constants — aligned with the Prisma InspectionStatus enum.

const INSPECTION_STATES = {
  REQUESTED: 'REQUESTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Legal state transitions: key = current state, value = allowed next states.
const VALID_TRANSITIONS = {
  [INSPECTION_STATES.REQUESTED]: [INSPECTION_STATES.CONFIRMED, INSPECTION_STATES.CANCELLED],
  [INSPECTION_STATES.CONFIRMED]: [INSPECTION_STATES.COMPLETED, INSPECTION_STATES.CANCELLED]
};

// REQUESTED inspections older than this are auto-expired by the cron job.
const INSPECTION_EXPIRY_HOURS = 48;

module.exports = { INSPECTION_STATES, VALID_TRANSITIONS, INSPECTION_EXPIRY_HOURS };
