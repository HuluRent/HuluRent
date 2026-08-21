// Business logic — booking creation, retrieval, and state transitions

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { transitionBookingState } = require('./bookings.state-machine');
const { checkBookingConflict } = require('./bookings.conflict-check');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');

class BookingsService {

  /**
   * Create a new booking request.
   */
  async requestBooking({ itemId, renterId, startDate, endDate }) {
    const { newBooking, item, renter } = await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new NotFoundError('Item not found');
      }

      if (item.ownerId === renterId) {
        throw new ForbiddenError('You cannot book your own listing');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        throw new ForbiddenError('End date must be after start date');
      }

      await checkBookingConflict(tx, itemId, start, end);

      const newBooking = await tx.booking.create({
        data: {
          itemId,
          renterId,
          ownerId: item.ownerId,
          agreedPrice: item.pricePerUnit,
          startDate: start,
          endDate: end,
          status: 'REQUESTED',
        },
      });

      const renter = await tx.user.findUnique({
        where: { id: renterId },
        include: { profile: true }
      });

      return { newBooking, item, renter };
    });

    try {
      const notificationsService = require('../notifications/notifications.service');
      const renterName = renter?.profile?.displayName || 'Someone';
      await notificationsService.notifyUser(
        item.ownerId,
        'BOOKING_REQUESTED',
        {
          bookingId: newBooking.id,
          itemId: item.id,
          itemName: item.name,
          renterId,
          message: `${renterName} requested to rent ${item.name}`
        }
      );
    } catch (error) {
      console.error('Failed to create notification for new booking:', error);
    }

    return newBooking;
  }

  /**
   * Get bookings belonging to the authenticated user.
   *
   * role=renter -> bookings where user is renter
   * role=owner  -> bookings where user owns the listing
   */
  async getMyBookings(userId, role = 'renter') {
    const where = role === 'owner'
      ? { ownerId: userId }
      : { renterId: userId };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        item: {
          select: {
            id: true,
            name: true,
            pricePerUnit: true,
            pricingUnit: true,
            images: true,
          }
        },
        owner: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        renter: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return bookings.map(booking => ({
      ...booking,
      owner: {
        id: booking.owner.id,
        displayName: booking.owner.profile?.displayName || 'Unknown User'
      },
      renter: {
        id: booking.renter.id,
        displayName: booking.renter.profile?.displayName || 'Unknown User'
      }
    }));
  }

  /**
   * Get a single booking.
   */
  async getBookingDetails(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            pricePerUnit: true,
            pricingUnit: true,
            images: true,
            ownerId: true,
          }
        },
        owner: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        renter: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.ownerId !== userId && booking.renterId !== userId) {
      throw new ForbiddenError('You do not have access to this booking');
    }

    return {
      ...booking,
      owner: {
        id: booking.owner.id,
        displayName: booking.owner.profile?.displayName || 'Unknown User'
      },
      renter: {
        id: booking.renter.id,
        displayName: booking.renter.profile?.displayName || 'Unknown User'
      }
    };
  }

  /**
   * Change booking state.
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

    if (
      ['ACCEPTED', 'REJECTED', 'ACTIVE', 'COMPLETED'].includes(newState) &&
      !isOwner
    ) {
      throw new ForbiddenError(
        `Only the owner can transition the booking to ${newState}`
      );
    }

    if (
      ['CONFIRMED', 'RETURN_PENDING'].includes(newState) &&
      !isRenter
    ) {
      throw new ForbiddenError(
        `Only the renter can transition the booking to ${newState}`
      );
    }

    if (newState === 'CANCELLED' && !isOwner && !isRenter) {
      throw new ForbiddenError('Only the booking participants can cancel');
    }

    const validatedState = transitionBookingState(
      booking.status,
      newState
    );

    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: validatedState },
    });
  }
}

module.exports = new BookingsService();
