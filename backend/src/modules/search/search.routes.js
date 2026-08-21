const { Router } = require('express');
const controller = require('./search.controller');
const validateQuery = require('../../shared/middleware/validate-request');
const { searchSchema } = require('./search.validation');

const searchRouter = Router();

// Notice we need a middleware that validates req.query instead of req.body.
// To keep it simple and reuse validate-request, we can wrap it or just write an inline validator
// Or we can modify validateRequest to accept a "source" param. For now, since validateRequest uses req.body, 
// let's create a small inline middleware for query validation here, or adapt the existing one.

// Actually, let's write a small wrapper for GET requests
const validateQueryRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const { ValidationError } = require('../../shared/errors/ValidationError');
    return next(new ValidationError('Validation failed', result.error.flatten()));
  }
  req.query = result.data; // replace with coerced data
  next();
};


searchRouter.get('/', validateQueryRequest(searchSchema), controller.list);

module.exports = { searchRouter };
