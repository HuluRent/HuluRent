// Request schema validation for inspection scheduling
// Uses Zod to match the validateRequest middleware (which calls .safeParse)

const { z } = require('zod');

const scheduleInspectionSchema = z.object({
  bookingId: z.string().uuid('bookingId must be a valid UUID'),
  scheduledAt: z.coerce.date().refine(
    (d) => d > new Date(),
    { message: 'scheduledAt must be a future date' }
  ),
  notes: z.string().max(1000).optional()
});

module.exports = {
  scheduleInspectionSchema
};
