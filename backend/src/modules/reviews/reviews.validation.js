const { z } = require('zod');

const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

module.exports = {
  createReviewSchema,
};
