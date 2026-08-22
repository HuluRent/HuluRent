const { z } = require('zod');

const createBookingSchema = z.object({
  itemId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
});

const updateStatusSchema = z.object({
  newState: z.enum([
    'REQUESTED',
    'ACCEPTED',
    'CONFIRMED',
    'ACTIVE',
    'RETURN_PENDING',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
    'EXPIRED',
    'DISPUTED'
  ])
});

module.exports = {
  createBookingSchema,
  updateStatusSchema
};