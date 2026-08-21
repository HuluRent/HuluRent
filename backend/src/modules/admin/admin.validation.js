const { z } = require('zod');

const updateReportStatusSchema = z.object({
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'])
});

const restrictUserSchema = z.object({
  restricted: z.boolean(),
  reason: z.string().optional()
});

module.exports = {
  updateReportStatusSchema,
  restrictUserSchema
};
