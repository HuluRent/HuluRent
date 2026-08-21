// Business logic — orchestrates state-machine + conflict-check, ownership checks

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { transitionBookingState } = require('./bookings.state-machine');
const { checkBookingConflict } = require('./bookings.conflict-check');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');

class BookingsService {
  
  /**
   * Handles creating a brand new booking request
   */
  async requestBooking({ itemId, renterId, startDate, endDate }) {
    return await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: itemId } });
      if (!item) {
        throw new NotFoundError('Item not found');
      }

      await checkBookingConflict(tx, itemId, new Date(startDate), new Date(endDate));

      const newBooking = await tx.booking.create({
        data: {
          itemId,
          renterId,
          ownerId: item.ownerId,
          agreedPrice: item.pricePerUnit,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'REQUESTED',
        },
      });

      return newBooking;
    });
  }

  /**
   * Handles moving a booking from one state to another (e.g., ACCEPTED to CONFIRMED)
   */
  async changeBookingStatus(bookingId, newState, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const isOwner = booking.ownerId === userId;
    const isRenter = booking.renterId === userId;

    if (['ACCEPTED','REJECTED', 'ACTIVE', 'COMPLETED'].includes(newState) && !isOwner) {
      throw new ForbiddenError(`Only the owner can transition the booking to ${newState}`);
    }

    if (['CONFIRMED', 'RETURN_PENDING'].includes(newState) && !isRenter) {
      throw new ForbiddenError(`Only the renter can transition the booking to ${newState}`);
    }

    const validatedState = transitionBookingState(booking.status, newState);

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: validatedState },
    });

    return updatedBooking;
  }
}

module.exports = new BookingsService();