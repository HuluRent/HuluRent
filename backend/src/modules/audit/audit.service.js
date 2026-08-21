// Records an AuditEvent — called from other services (e.g. admin.service.js), not exposed as an API.
// Fire-and-forget: never throws to the caller so it can't break the primary operation.

const auditRepo = require('./audit.repository');
const { parsePagination } = require('../../shared/utils/pagination');
const logger = require('../../config/logger');

const auditService = {
  /**
   * Log an audit event. Safe to call from any service — errors are
   * caught and logged, never propagated to the caller.
   */
  log({ actorId, action, entityType, entityId, metadata }) {
    auditRepo
      .createAuditEvent({ actorId, action, entityType, entityId, metadata })
      .catch((err) => {
        logger.error('Failed to write audit event', {
          action,
          entityType,
          entityId,
          error: err.message
        });
      });
  },

  /**
   * Fetch paginated, filtered audit events for the admin dashboard.
   */
  async getAuditLog(query = {}) {
    const { page, limit, skip } = parsePagination(query);

    const filters = {};
    if (query.action) filters.action = query.action;
    if (query.actorId) filters.actorId = query.actorId;
    if (query.entityType) filters.entityType = query.entityType;
    if (query.startDate) filters.startDate = query.startDate;
    if (query.endDate) filters.endDate = query.endDate;

    const [items, total] = await Promise.all([
      auditRepo.findAuditEvents({ filters, skip, limit }),
      auditRepo.countAuditEvents(filters)
    ]);

    return { items, page, limit, total };
  }
};

module.exports = auditService;
