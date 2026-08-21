const express = require('express');
const router = express.Router();

const bookingsController = require('./bookings.controller');
const authenticate = require('../../shared/middleware/authenticate');
const ownershipGuard = require('../../shared/middleware/ownership-guard');
const validateRequest = require('../../shared/middleware/validate-request');
const {
  createBookingSchema,
  updateStatusSchema
} = require('./bookings.schemas');
const { getBookingOwnerId } = require('./bookings.repository');

router.post(
  '/',
  authenticate,
  validateRequest(createBookingSchema),
  bookingsController.createBooking
);

// IMPORTANT: /mine must come before /:id
router.get(
  '/mine',
  authenticate,
  bookingsController.getMyBookings
);

router.get(
  '/:id',
  authenticate,
  bookingsController.getBookingDetails
);

router.patch(
  '/:id/status',
  authenticate,
  validateRequest(updateStatusSchema),
  ownershipGuard(getBookingOwnerId),
  bookingsController.updateBookingStatus
);

module.exports = { bookingsRouter: router };
