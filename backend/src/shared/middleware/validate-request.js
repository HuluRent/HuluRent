// Runs a module's *.validation.js schema against req, returns 400 on failure
// TODO: implement
const { ValidationError } = require('../errors/ValidationError');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new ValidationError('Validation failed', result.error.flatten()));
  }
  req.body = result.data;
  next();
};