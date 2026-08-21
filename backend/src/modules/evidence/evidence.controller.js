// Parses req, calls evidence.service, shapes HTTP response

const evidenceService = require('./evidence.service');
const asyncHandler = require('../../shared/utils/async-handler');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Controller to handle uploading evidence photos
 */
const uploadEvidence = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No image file provided');
  }

  const { bookingId } = req.params;
  const { stage } = req.body; 
  
  const uploaderId = req.user.userId || req.user.id;
  const role = req.user.role; 

  const photoUrl = `/uploads/${req.file.filename}`;

  const newEvidence = await evidenceService.submitEvidence({
    bookingId,
    uploaderId,
    role,
    photoUrl,
    stage,
  });

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