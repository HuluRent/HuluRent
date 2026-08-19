// Row-locked overlap check (SELECT ... FOR UPDATE) — app-level half of the dual overlap defense, see hulurent-docs ARCHITECTURE.md §3


// 1. Import our custom ConflictError class
const { ConflictError } = require('../../shared/errors/ConflictError');
const { BOOKING_STATES } = require('../../shared/constants/booking-states');

/**
 * 2. Function to check for date overlaps safely using a transaction lock.
 * @param {Object} tx - The active Prisma transaction object
 * @param {String} itemId - The ID of the item being booked
 * @param {Date} startDate - The requested start date
 * @param {Date} endDate - The requested end date
 */
async function checkBookingConflict(tx, itemId, startDate, endDate) {
  
  // 3. Execute a raw Postgres query with FOR UPDATE to lock the rows
  const conflicts = await tx.$queryRaw`
    SELECT id FROM "Booking"
    WHERE "itemId" = ${itemId}
      AND status IN (${BOOKING_STATES.CONFIRMED}, ${BOOKING_STATES.ACTIVE})
      AND (
        "startDate" < ${endDate} AND "endDate" > ${startDate}
      )
    FOR UPDATE;
  `;

  // 4. If the query returns any rows, an overlap exists
  if (conflicts.length > 0) {
    throw new ConflictError('This item is already booked for the requested dates.');
  }

  // 5. If it is empty, the dates are clear!
  return true;
}

module.exports = {
  checkBookingConflict,
};