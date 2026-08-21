const { Router } = require('express');
const asyncHandler = require('../../shared/utils/async-handler');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validateRequest = require('../../shared/middleware/validate-request');
const { ROLES } = require('../../shared/constants/roles');
const controller = require('./admin.controller');
const { updateReportStatusSchema, restrictUserSchema } = require('./admin.validation');

const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize(ROLES.ADMIN));

adminRouter.get('/reports', asyncHandler(controller.listReports));
adminRouter.patch('/reports/:id', validateRequest(updateReportStatusSchema), asyncHandler(controller.updateReportStatus));

adminRouter.get('/users', asyncHandler(controller.listUsers));
adminRouter.patch('/users/:id/restrict', validateRequest(restrictUserSchema), asyncHandler(controller.restrictUser));

adminRouter.get('/audit-log', asyncHandler(controller.listAuditLogs));

module.exports = { adminRouter };
