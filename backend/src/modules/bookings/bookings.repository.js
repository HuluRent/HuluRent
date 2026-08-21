const { prisma } = require('../../config/database'); 

const createBooking = async (bookingData) => {
  return await prisma.booking.create({
    data: bookingData
  });
};

const findBookingById = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId }
  });
};

const findConflictingBookings = async (itemId, startDate, endDate) => {
  return await prisma.booking.findMany({
    where: {
      itemId: itemId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      OR: [
        { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } } 
      ]
    }
  });
};

const updateBookingStatus = async (bookingId, newStatus) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus }
  });
};

const getBookingOwnerId = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { ownerId: true, renterId: true }
  });
  return booking ? [booking.ownerId, booking.renterId] : null;
};

module.exports = {
  createBooking,
  findBookingById,
  findConflictingBookings,
  updateBookingStatus,
  getBookingOwnerId
};
