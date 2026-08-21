// Parses req, calls bookings.service, shapes HTTP response

const bookingsService = require('./bookings.service');
const asyncHandler = require('../../shared/utils/async-handler');

const createBooking = asyncHandler(async (req, res) => {
  const { itemId, startDate, endDate } = req.body;
  const renterId = req.user.userId;

  const newBooking = await bookingsService.requestBooking({
    itemId,
    renterId,
    startDate,
    endDate,
  });

  res.status(201).json({
    success: true,
    data: newBooking,
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const role = req.query.role === 'owner' ? 'owner' : 'renter';

  const bookings = await bookingsService.getMyBookings(userId, role);

  res.status(200).json({
    success: true,
    data: {
      items: bookings,
    },
  });
});

const getBookingDetails = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.userId;

  const booking = await bookingsService.getBookingDetails(
    bookingId,
    userId
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { newState } = req.body;
  const userId = req.user.userId;

  const updatedBooking =
    await bookingsService.changeBookingStatus(
      bookingId,
      newState,
      userId
    );

  res.status(200).json({
    success: true,
    data: updatedBooking,
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  updateBookingStatus,
};
