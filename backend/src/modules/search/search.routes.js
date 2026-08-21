const { Router } = require('express');
const controller = require('./search.controller');
const validateQuery = require('../../shared/middleware/validate-request');
const { searchSchema } = require('./search.validation');

const searchRouter = Router();


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
