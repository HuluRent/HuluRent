// Request schema validation for booking create/status-change payloads
const Joi = require('joi');

// Schema for requesting a new booking
const createBookingSchema = Joi.object({
  itemId: Joi.string().required().messages({
    'string.empty': 'Item ID is required to make a booking.'
  }),
  startDate: Joi.date().iso().min('now').required().messages({
    'date.min': 'Start date cannot be in the past.',
    'date.format': 'Start date must be a valid ISO format.'
  }),
  // Joi.ref ensures the endDate is strictly greater than the startDate provided in the same request
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'End date must be strictly after the start date.'
  })
});

// Schema for updating booking status via the state machine
const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELED').required()
});

// Middleware for booking creation
const validateCreateBooking = (req, res, next) => {
  const { error } = createBookingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking data',
      errors: error.details.map(err => err.message)
    });
  }
  next();
};

// Middleware for status updates
const validateUpdateStatus = (req, res, next) => {
  const { error } = updateBookingStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status update',
      errors: error.details.map(err => err.message)
    });
  }
  next();
};

module.exports = {
  validateCreateBooking,
  validateUpdateStatus
};
