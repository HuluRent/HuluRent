// Business logic — orchestrates state-machine + conflict-check, ownership checks
// TODO: implement
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Import your Day 1 logic
const { transitionBookingState } = require('./bookings.state-machine');
const { checkBookingConflict } = require('./bookings.conflict-check');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

class BookingsService {
  
  /**
   * Handles creating a brand new booking request
   */
  async requestBooking({ itemId, renterId, startDate, endDate }) {
    
    // 2. Start a Prisma Transaction 
    // This ensures that if any step fails, the whole process rolls back safely
    return await prisma.$transaction(async (tx) => {
      
      // 3. Run your conflict checker to lock the rows and prevent double-booking
      await checkBookingConflict(tx, itemId, new Date(startDate), new Date(endDate));

      // 4. If the dates are clear, create the booking in PostgreSQL
      const newBooking = await tx.booking.create({
        data: {
          itemId,
          renterId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'REQUESTED', // All new bookings start here
        },
      });

      return newBooking;
    });
  }

  /**
   * Handles moving a booking from one state to another (e.g., ACCEPTED to CONFIRMED)
   */
  async changeBookingStatus(bookingId, newState, userId) {
    
    // 5. Fetch the current booking from the database
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 6. Run your state machine! 
    // If they try an illegal move, this throws an error and stops the function dead in its tracks.
    const validatedState = transitionBookingState(booking.status, newState);

    // 7. If the move is legal, update the database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: validatedState },
    });

    return updatedBooking;
  }
}

// 8. Export a single instance of the service
module.exports = new BookingsService();