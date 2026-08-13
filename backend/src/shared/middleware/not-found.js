// 404 handler for any request that didn't match a mounted route.
// Must be registered after all routes, before error-handler.js.

function notFound(req, res, next) {
  res.status(404).json({ error: { message: `Not found: ${req.method} ${req.originalUrl}` } });
}

module.exports = { notFound };
