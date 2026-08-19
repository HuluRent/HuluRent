const { z } = require('zod');

const initiateSchema = z.object({
  idNumber: z.string().min(1, 'ID number is required')
});

const verifySchema = z.object({
  idNumber: z.string().min(1, 'ID number is required'),
  otp: z.string().min(1, 'OTP is required')
});

module.exports = {
  initiateSchema,
  verifySchema
};
