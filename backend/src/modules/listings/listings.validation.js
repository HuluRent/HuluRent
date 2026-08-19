const { z } = require('zod');

const createListingSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  pricePerUnit: z.coerce.number().positive(),
  pricingUnit: z.enum(['hour', 'day', 'week', 'month']),
  depositAmount: z.coerce.number().positive().optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  approxLocation: z.string().min(2).max(100)
});

const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(['DRAFT', 'PUBLISHED', 'UNAVAILABLE', 'SUSPENDED', 'ARCHIVED']).optional()
});

module.exports = {
  createListingSchema,
  updateListingSchema
};
