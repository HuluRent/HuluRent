// Row-locked overlap check (SELECT ... FOR UPDATE) — app-level half of the dual overlap defense, see hulurent-docs ARCHITECTURE.md §3

const { ConflictError } = require('../../shared/errors/ConflictError');
const { BOOKING_STATES } = require('../../shared/constants/booking-states');

/**
 * Function to check for date overlaps safely using a transaction lock.
 * @param {Object} tx - The active Prisma transaction object
 * @param {String} itemId - The ID of the item being booked
 * @param {Date} startDate - The requested start date
 * @param {Date} endDate - The requested end date
 */
async function checkBookingConflict(tx, itemId, startDate, endDate) {

  // 1. Check if dates fall within owner-defined Availability windows (if any exist)
  const availabilities = await tx.availability.findMany({
    where: { itemId }
  });

  if (availabilities.length > 0) {
    const isAvailable = availabilities.some(window => {
      // The entire requested period must fall within a single availability window
      // Note: A more complex system might allow spanning multiple contiguous windows,
      // but the simplest robust approach is requiring it to fit in one window.
      return startDate >= window.startDate && endDate <= window.endDate;
    });

    if (!isAvailable) {
      throw new ConflictError('The requested dates are not marked as available by the owner.');
    }
  }

  // 2. Check for overlapping confirmed/active bookings
  const conflicts = await tx.$queryRaw`
    SELECT id FROM "Booking"
    WHERE "itemId" = ${itemId}
      AND status IN (${BOOKING_STATES.ACCEPTED}::"BookingStatus", ${BOOKING_STATES.CONFIRMED}::"BookingStatus", ${BOOKING_STATES.ACTIVE}::"BookingStatus")
      AND (
        "startDate" < ${endDate} AND "endDate" > ${startDate}
      )
    FOR UPDATE;
  `;

  if (conflicts.length > 0) {
    throw new ConflictError('This item is already booked for the requested dates.');
  }

  return true;
}

module.exports = {
  checkBookingConflict,
};