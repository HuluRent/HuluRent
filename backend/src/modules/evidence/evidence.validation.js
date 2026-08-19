// Request schema validation for evidence submission
const Joi = require('joi');

// Schema for the text data accompanying an evidence upload
const submitEvidenceSchema = Joi.object({
  bookingId: Joi.string().required().messages({
    'string.empty': 'Booking ID is required to attach evidence.'
  }),
  stage: Joi.string().valid('PRE_HANDOFF', 'POST_RETURN', 'DAMAGE_REPORT').required().messages({
    'any.only': 'Evidence stage must be PRE_HANDOFF, POST_RETURN, or DAMAGE_REPORT.'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters.'
  })
});

// Middleware to validate the evidence metadata
const validateEvidenceData = (req, res, next) => {
  // Multer populates req.body with the text fields from the multipart/form-data
  const { error } = submitEvidenceSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid evidence submission data',
      errors: error.details.map(err => err.message)
    });
  }
  
  next();
};

module.exports = {
  validateEvidenceData
};
