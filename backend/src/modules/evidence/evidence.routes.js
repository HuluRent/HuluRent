// Express routes for pickup/return evidence submission.
// TODO: add real route handlers — wire middleware (authenticate, authorize,
// ownershipGuard, validateRequest) in order, then delegate to the controller.

const express = require('express');
const router = express.Router();

const evidenceController = require('./evidence.controller');
const authenticate = require('../../shared/middleware/authenticate');
const upload = require('../../shared/middleware/upload'); // Your multer configuration

// 1. POST route to upload a condition photo
// 'photo' matches the key name the frontend must use in FormData
router.post(
  '/:bookingId',
  authenticate,
  upload.single('photo'), 
  evidenceController.uploadEvidence
);

// 2. GET route to view all evidence photos for a booking
router.get(
  '/:bookingId',
  authenticate,
  evidenceController.getBookingEvidence
);

module.exports = router;