// Parses req, calls evidence.service, shapes HTTP response

const evidenceService = require('./evidence.service');
const asyncHandler = require('../../shared/utils/async-handler');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Controller to handle uploading evidence photos
 */
const uploadEvidence = asyncHandler(async (req, res) => {
  // 1. Ensure a file was actually uploaded via multer middleware
  if (!req.file) {
    throw new ValidationError('No image file provided');
  }

  // 2. Extract data from request parameters and body
  const { bookingId } = req.params;
  const { stage } = req.body; // 'PICKUP' or 'RETURN'
  
  // 3. Extract user details securely from authentication
  const uploaderId = req.user.id;
  const role = req.user.role; // 'OWNER' or 'RENTER'

  // 4. Construct the file path/URL from multer's file output
  const photoUrl = `/uploads/${req.file.filename}`;

  // 5. Send data to the service layer
  const newEvidence = await evidenceService.submitEvidence({
    bookingId,
    uploaderId,
    role,
    photoUrl,
    stage,
  });

  // 6. Respond with success
  res.status(201).json({
    success: true,
    data: newEvidence,
  });
});

/**
 * Controller to view all evidence for a booking
 */
const getBookingEvidence = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const evidenceList = await evidenceService.viewEvidence(bookingId);

  res.status(200).json({
    success: true,
    data: evidenceList,
  });
});

module.exports = {
  uploadEvidence,
  getBookingEvidence,
};