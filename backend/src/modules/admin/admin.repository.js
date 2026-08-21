const { prisma } = require('../../config/database');

async function findReports({ page = 1, limit = 20, status }) {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
        subject: { select: { id: true, email: true, profile: { select: { displayName: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.report.count({ where })
  ]);

  return {
    items: items.map(report => ({
      ...report,
      author: report.author ? { ...report.author, displayName: report.author.profile?.displayName } : null,
      subject: report.subject ? { ...report.subject, displayName: report.subject.profile?.displayName } : null
    })),
    total
  };
}

async function findReportById(id) {
  return prisma.report.findUnique({ where: { id } });
}

async function updateReportStatus(id, status, adminId) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.update({
      where: { id },
      data: { status, resolvedAt: status === 'RESOLVED' || status === 'DISMISSED' ? new Date() : null },
      include: {
        author: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
        subject: { select: { id: true, email: true, profile: { select: { displayName: true } } } }
      }
    });

    await tx.auditEvent.create({
      data: {
        actorId: adminId,
        action: 'UPDATE_REPORT_STATUS',
        entityType: 'Report',
        entityId: id,
        metadata: { newStatus: status }
      }
    });

    return {
      ...report,
      author: report.author ? { ...report.author, displayName: report.author.profile?.displayName } : null,
      subject: report.subject ? { ...report.subject, displayName: report.subject.profile?.displayName } : null
    };
  });
}

async function findUsers({ page = 1, limit = 20, q }) {
  const skip = (page - 1) * limit;
  const where = q ? {
    OR: [
      { email: { contains: q, mode: 'insensitive' } },
      { profile: { displayName: { contains: q, mode: 'insensitive' } } }
    ]
  } : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        role: true,
        isRestricted: true,
        restrictionReason: true,
        createdAt: true,
        profile: { select: { displayName: true, avatarUrl: true } },
        _count: { select: { reportsAgainst: true, itemsOwned: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    items: items.map(u => ({
      ...u,
      displayName: u.profile?.displayName,
      restricted: u.isRestricted
    })),
    total
  };
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function updateUserRestriction(userId, restricted, reason, adminId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        isRestricted: restricted,
        restrictionReason: restricted ? reason : null
      },
      select: {
        id: true,
        email: true,
        role: true,
        isRestricted: true,
        restrictionReason: true,
        createdAt: true,
        profile: { select: { displayName: true, avatarUrl: true } }
      }
    });

    await tx.auditEvent.create({
      data: {
        actorId: adminId,
        action: restricted ? 'RESTRICT_USER' : 'UNRESTRICT_USER',
        entityType: 'User',
        entityId: userId,
        metadata: { reason }
      }
    });

    return {
      ...user,
      displayName: user.profile?.displayName,
      restricted: user.isRestricted
    };
  });
}

async function findAuditLogs({ page = 1, limit = 50 }) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.auditEvent.findMany({
      skip,
      take: limit,
      include: {
        actor: { select: { email: true, profile: { select: { displayName: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.auditEvent.count()
  ]);

  return { items, total };
}

/**
 * Update a user's isRestricted status.
 */
const updateUserRestriction = async (id, isRestricted) => {
  return prisma.user.update({
    where: { id },
    data: { isRestricted },
    select: { id: true, email: true, role: true, isRestricted: true }
  });
};

module.exports = {
  findReports,
<<<<<<< Updated upstream
  findReportById,
  updateReportStatus,
  findUsers,
  findUserById,
  updateUserRestriction,
  findAuditLogs
=======
  countReports,
  updateReportStatus,
  updateUserRestriction
>>>>>>> Stashed changes
};
