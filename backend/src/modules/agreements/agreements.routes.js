// Express routes for rental agreement view/accept.

const express = require('express');
const router = express.Router();

const agreementsController = require('./agreements.controller');
const authenticate = require('../../shared/middleware/authenticate');

router.post(
  '/:bookingId',
  authenticate,
  agreementsController.createAgreement
);

router.post(
  '/:bookingId/sign',
  authenticate,
  agreementsController.signAgreement
);

module.exports = { agreementsRouter: router };