// Prisma queries for admin views (users, reports, audit events)

const { prisma } = require('../../config/database');

/**
 * Paginated user listing with optional search on email or displayName.
 */
const findUsers = async ({ search, skip = 0, limit = 20 }) => {
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { displayName: { contains: search, mode: 'insensitive' } } }
        ]
      }
    : {};

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      profile: { select: { displayName: true } }
    }
  });
};

/**
 * Count users matching the search filter (for pagination).
 */
const countUsers = async (search) => {
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { displayName: { contains: search, mode: 'insensitive' } } }
        ]
      }
    : {};

  return prisma.user.count({ where });
};

/**
 * Find a single user by ID.
 */
const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true }
  });
};

/**
 * Paginated report listing.
 */
const findReports = async ({ skip = 0, limit = 20 }) => {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      author: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
      subject: { select: { id: true, email: true, profile: { select: { displayName: true } } } }
    }
  });
};

/**
 * Count total reports (for pagination).
 */
const countReports = async () => {
  return prisma.report.count();
};

/**
 * Update a report's status and optionally set resolvedAt.
 */
const updateReportStatus = async (id, status) => {
  const data = { status };
  if (status === 'RESOLVED' || status === 'DISMISSED') {
    data.resolvedAt = new Date();
  }
  return prisma.report.update({ where: { id }, data });
};

module.exports = {
  findUsers,
  countUsers,
  findUserById,
  findReports,
  countReports,
  updateReportStatus
};
