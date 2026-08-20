// Prisma queries for Booking
// Handles direct database interactions for the bookings module
// Note: Replace `db` with your actual database client import (e.g., Prisma, Sequelize, or pg)
const db = require('../../config/database'); 

const createBooking = async (bookingData) => {
  return await db.booking.create({
    data: bookingData
  });
};

const findBookingById = async (bookingId) => {
  return await db.booking.findUnique({
    where: { id: bookingId }
  });
};

const findConflictingBookings = async (itemId, startDate, endDate) => {
  // Queries the database to find if the item is already booked during the requested dates
  return await db.booking.findMany({
    where: {
      itemId: itemId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }, // Ignores canceled or rejected bookings
      OR: [
        // Checks for overlapping date ranges
        { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } } 
      ]
    }
  });
};

const updateBookingStatus = async (bookingId, newStatus) => {
  return await db.booking.update({
    where: { id: bookingId },
    data: { status: newStatus }
  });
};

module.exports = {
  createBooking,
  findBookingById,
  findConflictingBookings,
  updateBookingStatus
};
