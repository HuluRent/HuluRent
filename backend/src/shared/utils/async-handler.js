// Wraps an async route handler so thrown errors reach error-handler.js instead of hanging the request
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
