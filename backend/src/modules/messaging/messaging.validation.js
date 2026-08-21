const { z } = require('zod');

const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(2000, 'Message content must be 2000 characters or less'),
});

const messagePaginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .default(50),
});

const startConversationSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
});

module.exports = {
  sendMessageSchema,
  messagePaginationSchema,
  startConversationSchema,
};
