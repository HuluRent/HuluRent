// Parses req, calls bookings.service, shapes HTTP response

const bookingsService = require('./bookings.service');
// asyncHandler wraps our controllers so we don't have to write try/catch blocks everywhere
const asyncHandler = require('../../shared/utils/async-handler');

const createBooking = asyncHandler(async (req, res) => {
  // 1. Extract the validated data from the request body
  const { itemId, startDate, endDate } = req.body;
  
  // 2. Extract the user ID from the authentication middleware
  const renterId = req.user.id; 

  // 3. Pass everything to the Service layer
  const newBooking = await bookingsService.requestBooking({
    itemId,
    renterId,
    startDate,
    endDate,
  });

  // 4. Send the successful HTTP response
  res.status(201).json({
    success: true,
    data: newBooking,
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { newState } = req.body;
  const userId = req.user.id;

  const updatedBooking = await bookingsService.changeBookingStatus(bookingId, newState, userId);

  res.status(200).json({
    success: true,
    data: updatedBooking,
  });
});

module.exports = {
  createBooking,
  updateBookingStatus,
};