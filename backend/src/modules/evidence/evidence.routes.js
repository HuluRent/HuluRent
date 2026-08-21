
// ownershipGuard, validateRequest) in order, then delegate to the controller.

const express = require('express');
const router = express.Router();

const evidenceController = require('./evidence.controller');
const authenticate = require('../../shared/middleware/authenticate');
const upload = require('../../shared/middleware/upload');

router.post(
  '/:bookingId',
  authenticate,
  upload.single('photo'), 
  evidenceController.uploadEvidence
);

router.get(
  '/:bookingId',
  authenticate,
  evidenceController.getBookingEvidence
);

module.exports = { evidenceRouter: router };