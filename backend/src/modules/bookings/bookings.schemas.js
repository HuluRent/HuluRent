const Joi = require('joi');

const createBookingSchema = Joi.object({
  propertyId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed')
    .required()
});

module.exports = {
  createBookingSchema,
  updateStatusSchema
};