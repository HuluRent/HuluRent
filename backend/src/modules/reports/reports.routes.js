const { Router } = require('express');
const controller = require('./reports.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validateRequest = require('../../shared/middleware/validate-request');
const asyncHandler = require('../../shared/utils/async-handler');
const { createReportSchema, updateReportStatusSchema } = require('./reports.validation');

const reportsRouter = Router();

// Any authenticated user can file a report
reportsRouter.post('/', authenticate, validateRequest(createReportSchema), asyncHandler(controller.create));

// Only admins can list all reports or update status
reportsRouter.get('/', authenticate, authorize('ADMIN'), asyncHandler(controller.list));
reportsRouter.put('/:id/status', authenticate, authorize('ADMIN'), validateRequest(updateReportStatusSchema), asyncHandler(controller.updateStatus));

module.exports = { reportsRouter };
