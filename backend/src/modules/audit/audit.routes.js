// Express routes for admin audit log viewing.

const { Router } = require('express');
const auditController = require('./audit.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');

const auditRouter = Router();

// GET /admin/audit-log — paginated, filtered audit events (admin only)
auditRouter.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  auditController.getAuditLog
);

module.exports = { auditRouter };
