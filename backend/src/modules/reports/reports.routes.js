const { Router } = require('express');
const controller = require('./reports.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validateRequest = require('../../shared/middleware/validate-request');
const { createReportSchema, updateReportStatusSchema } = require('./reports.validation');

const reportsRouter = Router();

// Any authenticated user can file a report
reportsRouter.post('/', authenticate, validateRequest(createReportSchema), controller.create);

// Only admins can list all reports or update status
reportsRouter.get('/', authenticate, authorize('ADMIN'), controller.list);
reportsRouter.put('/:id/status', authenticate, authorize('ADMIN'), validateRequest(updateReportStatusSchema), controller.updateStatus);

module.exports = { reportsRouter };
