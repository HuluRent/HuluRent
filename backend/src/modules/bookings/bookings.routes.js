const express = require('express');
const router = express.Router();

// 1. Import our Controllers (we will build this next)
const bookingsController = require('./bookings.controller');

// 2. Import our Day 1 Middlewares
const authenticate = require('../../shared/middleware/authenticate');
const ownershipGuard = require('../../shared/middleware/ownership-guard');
const validateRequest = require('../../shared/middleware/validate-request');

// 3. Import Validation Schemas (assuming you have a Joi schema defined)
const { createBookingSchema, updateStatusSchema } = require('./bookings.validation');

// 4. Import the database helper for the ownership guard
const { getBookingOwnerId } = require('./bookings.repository');

/**
 * POST /api/bookings
 * Protected by authentication and request validation.
 */
router.post(
  '/',
  authenticate,
  validateRequest(createBookingSchema),
  bookingsController.createBooking
);

/**
 * PATCH /api/bookings/:id/status
 * Protected by auth, validates the new state, AND ensures only the owner can modify it.
 */
router.patch(
  '/:id/status',
  authenticate,
  validateRequest(updateStatusSchema),
  ownershipGuard(getBookingOwnerId),
  bookingsController.updateBookingStatus
);

module.exports = router;