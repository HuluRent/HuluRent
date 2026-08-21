const { z } = require('zod');

const addSavedListingSchema = z.object({
  listingId: z.string().uuid(),
});

module.exports = { addSavedListingSchema };
