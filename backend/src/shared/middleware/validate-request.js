// Runs a module's *.validation.js schema against req, returns 400 on failure
// TODO: implement
// 1. Import our custom ValidationError class
const { ValidationError } = require('../errors/ValidationError');

/**
 * 2. Factory function that takes a validation schema and returns a middleware
 */
const validateRequest = (schema) => {
  
  // 3. The actual Express middleware
  return (req, res, next) => {
    
    // 4. Validate the incoming request body against the provided schema
    // abortEarly: false ensures we collect ALL errors, not just the first one
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    // 5. If there is a mismatch, format the errors and reject the request
    if (error) {
      // Map over the Joi error details to create a readable string
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      // Pass the formatted error to our central error-handler.js
      return next(new ValidationError(`Data validation failed: ${errorMessage}`));
    }
    
    // 6. If the data is perfectly valid, proceed to the controller
    next();
  };
};

module.exports = validateRequest;