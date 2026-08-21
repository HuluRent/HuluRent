// Prisma queries for AuditEvent

const { prisma } = require('../../config/database');

/**
 * Create a single audit event record.
 */
const createAuditEvent = async ({ actorId, action, entityType, entityId, metadata }) => {
  return prisma.auditEvent.create({
    data: {
      actorId: actorId || null,
      action,
      entityType,
      entityId,
      metadata: metadata || null
    }
  });
};

/**
 * Paginated, filtered query for admin audit log view.
 * Supports filters: action, actorId, entityType, startDate, endDate.
 */
const findAuditEvents = async ({ filters = {}, skip = 0, limit = 20 }) => {
  const where = _buildWhereClause(filters);

  return prisma.auditEvent.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          role: true,
          profile: { select: { displayName: true } }
        }
      }
    }
  });
};

/**
 * Count matching audit events for pagination totals.
 */
const countAuditEvents = async (filters = {}) => {
  const where = _buildWhereClause(filters);
  return prisma.auditEvent.count({ where });
};

// ── Private helpers ──────────────────────────────────────────────────

function _buildWhereClause(filters) {
  const where = {};

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.actorId) {
    where.actorId = filters.actorId;
  }

  if (filters.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  return where;
}

module.exports = {
  createAuditEvent,
  findAuditEvents,
  countAuditEvents
};
