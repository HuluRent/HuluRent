const { z } = require('zod');

const createReportSchema = z.object({
  subjectId: z.string().uuid("Invalid user ID").optional(),
  reason: z.string().min(5).max(100),
  details: z.string().max(2000).optional(),
});

const updateReportStatusSchema = z.object({
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'])
});

module.exports = {
  createReportSchema,
  updateReportStatusSchema
};
