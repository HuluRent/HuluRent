// Parses req, calls agreements.service, shapes HTTP response

const agreementsService = require('./agreements.service');
const asyncHandler = require('../../shared/utils/async-handler');

/**
 * Controller to handle creating a new agreement
 */
const createAgreement = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { termsText } = req.body;

  const agreement = await agreementsService.generateAgreement(bookingId, termsText);

  res.status(201).json({
    success: true,
    data: agreement,
  });
});

/**
 * Controller to handle a user signing the agreement
 */
const signAgreement = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  
  const userId = req.user.userId;

  const updatedAgreement = await agreementsService.signAgreement(bookingId, userId);

  res.status(200).json({
    success: true,
    data: updatedAgreement,
  });
});

module.exports = {
  createAgreement,
  signAgreement,
};