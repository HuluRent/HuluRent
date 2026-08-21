const Joi = require('joi'); 

const acceptAgreementSchema = Joi.object({
  agreementId: Joi.string().required().messages({
    'string.empty': 'Agreement ID is required.'
  }),
  digitalSignature: Joi.string().min(2).required().messages({
    'string.empty': 'A digital signature (your full name) is required to accept terms.'
  }),
  accepted: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must explicitly accept the agreement terms to proceed.'
  })
});

// Middleware to protect the agreement acceptance route
const validateAgreementAcceptance = (req, res, next) => {
  // Merge req.body and req.params so we can validate both the ID and the payload
  const payload = { ...req.body, agreementId: req.params.id };
  const { error } = acceptAgreementSchema.validate(payload, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(err => err.message)
    });
  }
  
  next();
};

module.exports = {
  validateAgreementAcceptance
};
