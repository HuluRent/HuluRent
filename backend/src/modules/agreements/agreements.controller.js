// Parses req, calls agreements.service, shapes HTTP response

const agreementsService = require('./agreements.service');
const asyncHandler = require('../../shared/utils/async-handler');

/**
 * Controller to handle creating a new agreement
 */
const createAgreement = asyncHandler(async (req, res) => {
  // 1. Extract data from the URL (params) and the JSON body
  const { bookingId } = req.params;
  const { termsText } = req.body;

  // 2. Pass the data to the Service layer
  const agreement = await agreementsService.generateAgreement(bookingId, termsText);

  // 3. Send a 201 (Created) HTTP response back to the client
  res.status(201).json({
    success: true,
    data: agreement,
  });
});

/**
 * Controller to handle a user signing the agreement
 */
const signAgreement = asyncHandler(async (req, res) => {
  // 4. Extract the booking ID from the URL
  const { bookingId } = req.params;
  
  // 5. Extract the logged-in user's ID and Role from the auth middleware
  const userId = req.user.id;
  const userRole = req.user.role; // Expected to be 'OWNER' or 'RENTER'

  // 6. Pass the user's details to the Service to process the signature
  const updatedAgreement = await agreementsService.signAgreement(bookingId, userId, userRole);

  // 7. Send a 200 (OK) HTTP response back
  res.status(200).json({
    success: true,
    data: updatedAgreement,
  });
});

module.exports = {
  createAgreement,
  signAgreement,
};