const reviewsRepo = require('./reviews.repository');
const bookingsRepo = require('../bookings/bookings.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');
const { ConflictError } = require('../../shared/errors/ConflictError');

async function createReview(authorId, data) {
  const { bookingId, rating, comment } = data;

  const booking = await bookingsRepo.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check if author is a participant
  if (booking.ownerId !== authorId && booking.renterId !== authorId) {
    throw new ForbiddenError('You can only review bookings you participated in');
  }

  // Determine the subject of the review
  const subjectId = booking.ownerId === authorId ? booking.renterId : booking.ownerId;

  try {
    return await reviewsRepo.create({
      authorId,
      subjectId,
      bookingId,
      rating,
      comment
    });
  } catch (error) {
    // Prisma throws P2002 on unique constraint violation
    if (error.code === 'P2002') {
      throw new ConflictError('You have already reviewed this booking');
    }
    throw error;
  }
}

async function getReviewsForSubject(subjectId) {
  return reviewsRepo.findBySubjectId(subjectId);
}

async function getReviewsForBooking(bookingId) {
  return reviewsRepo.findByBookingId(bookingId);
}

async function getSubjectStats(subjectId) {
  return reviewsRepo.getAverageRating(subjectId);
}

module.exports = {
  createReview,
  getReviewsForSubject,
  getReviewsForBooking,
  getSubjectStats
};
