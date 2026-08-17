// Express routes for rental agreement view/accept.

// ownershipGuard, validateRequest) in order, then delegate to the controller.

const express = require('express');
const router = express.Router();

const agreementsController = require('./agreements.controller');
const authenticate = require('../../shared/middleware/authenticate');

// 1. Route to create a new agreement for a specific booking
// Example URL: POST /api/agreements/b5a2-4f1c-9923
router.post(
  '/:bookingId',
  authenticate,
  agreementsController.createAgreement
);

// 2. Route for a user to digitally sign an agreement
// Example URL: POST /api/agreements/b5a2-4f1c-9923/sign
router.post(
  '/:bookingId/sign',
  authenticate,
  agreementsController.signAgreement
);

module.exports = router;
