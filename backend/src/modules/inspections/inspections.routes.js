// Express routes for inspection scheduling/confirmation.

const { Router } = require('express');
const inspectionsController = require('./inspections.controller');
const authenticate = require('../../shared/middleware/authenticate');
const ownershipGuard = require('../../shared/middleware/ownership-guard');
const validateRequest = require('../../shared/middleware/validate-request');
const { scheduleInspectionSchema } = require('./inspections.validation');
const { getInspectionParticipantIds } = require('./inspections.repository');

const inspectionsRouter = Router();

// POST /inspections — schedule a new inspection
inspectionsRouter.post(
  '/',
  authenticate,
  validateRequest(scheduleInspectionSchema),
  inspectionsController.schedule
);

// GET /inspections/:bookingId — list inspections for a booking
inspectionsRouter.get(
  '/:bookingId',
  authenticate,
  inspectionsController.getByBooking
);

// PATCH /inspections/:id/confirm — confirm a requested inspection
inspectionsRouter.patch(
  '/:id/confirm',
  authenticate,
  ownershipGuard(getInspectionParticipantIds),
  inspectionsController.confirm
);

// PATCH /inspections/:id/complete — mark inspection as completed
inspectionsRouter.patch(
  '/:id/complete',
  authenticate,
  ownershipGuard(getInspectionParticipantIds),
  inspectionsController.complete
);

// PATCH /inspections/:id/cancel — cancel inspection
inspectionsRouter.patch(
  '/:id/cancel',
  authenticate,
  ownershipGuard(getInspectionParticipantIds),
  inspectionsController.cancel
);

module.exports = { inspectionsRouter };
