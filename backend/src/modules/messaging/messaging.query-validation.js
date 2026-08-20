const { ValidationError } = require('../../shared/errors/ValidationError');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return next(
      new ValidationError('Validation failed', result.error.flatten())
    );
  }

  req.query = result.data;
  next();
};
