const { z } = require('zod');

const registerSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  // Explicitly prevent registering as an ADMIN
  role: z.literal('USER').optional().default('USER'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = { registerSchema, loginSchema };