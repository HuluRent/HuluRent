// Express routes for moderation queue, user restriction, audit log view.

const { Router } = require('express');
const adminController = require('./admin.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const { auditRouter } = require('../audit/audit.routes');

const adminRouter = Router();

// All admin routes require authentication + ADMIN role
adminRouter.use(authenticate);
adminRouter.use(authorize('ADMIN'));

// GET /admin/users — paginated user listing with search
adminRouter.get('/users', adminController.getUsers);

// PATCH /admin/users/:id/restrict — restrict/unrestrict a user
adminRouter.patch('/users/:id/restrict', adminController.restrictUser);

// GET /admin/reports — paginated report listing
adminRouter.get('/reports', adminController.getReports);

// PATCH /admin/reports/:id — update report status
adminRouter.patch('/reports/:id', adminController.updateReportStatus);

// GET /admin/audit-log — mount the audit sub-router
adminRouter.use('/audit-log', auditRouter);

module.exports = { adminRouter };
