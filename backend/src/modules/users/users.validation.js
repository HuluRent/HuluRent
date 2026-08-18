const { z } = require('zod');

const updateProfileSchema = z.object({
 displayName: z.string().min(3).optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
module.exports = { updateProfileSchema };
    