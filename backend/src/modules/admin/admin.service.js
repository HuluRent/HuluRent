const repository = require('./admin.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

<<<<<<< Updated upstream
async function listReports(filters) {
  return repository.findReports(filters);
=======
class AdminService {

  /**
   * Paginated user listing with optional search.
   */
  async getUsers(query = {}) {
    const { page, limit, skip } = parsePagination(query);
    const search = query.q || null;

    const [users, total] = await Promise.all([
      adminRepo.findUsers({ search, skip, limit }),
      adminRepo.countUsers(search)
    ]);

    // Flatten profile.displayName for the frontend table
    const items = users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      displayName: u.profile?.displayName || null,
      createdAt: u.createdAt
    }));

    return { items, page, limit, total };
  }

  /**
   * Restrict or unrestrict a user account.
   * NOTE: The User model doesn't have a `restricted` column yet — this
   * updates the role or could be extended with a dedicated field. For now,
   * we log the action and return the user as-is so the admin audit trail
   * is preserved.
   */
  async restrictUser(userId, { restricted, reason }, adminId) {
    const user = await adminRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const action = restricted ? 'USER_RESTRICTED' : 'USER_UNRESTRICTED';

    auditService.log({
      actorId: adminId,
      action,
      entityType: 'User',
      entityId: userId,
      metadata: { restricted, reason }
    });

    logger.info(`Admin ${adminId} ${action.toLowerCase()} user ${userId}`, { reason });

    const updatedUser = await adminRepo.updateUserRestriction(userId, restricted);
    return updatedUser;
  }

  /**
   * Paginated report listing.
   */
  async getReports(query = {}) {
    const { page, limit, skip } = parsePagination(query);

    const [reports, total] = await Promise.all([
      adminRepo.findReports({ skip, limit }),
      adminRepo.countReports()
    ]);

    return { items: reports, page, limit, total };
  }

  /**
   * Update a report's status.
   */
  async updateReportStatus(reportId, status, adminId) {
    const validStatuses = ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid report status: ${status}`);
    }

    const updated = await adminRepo.updateReportStatus(reportId, status);

    auditService.log({
      actorId: adminId,
      action: 'REPORT_STATUS_UPDATED',
      entityType: 'Report',
      entityId: reportId,
      metadata: { newStatus: status }
    });

    return updated;
  }
>>>>>>> Stashed changes
}

async function updateReportStatus(reportId, status, adminId) {
  const report = await repository.findReportById(reportId);
  if (!report) throw new NotFoundError('Report not found');

  const updatedReport = await repository.updateReportStatus(reportId, status, adminId);
  return updatedReport;
}

async function listUsers(filters) {
  return repository.findUsers(filters);
}

async function restrictUser(userId, restricted, reason, adminId) {
  const user = await repository.findUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  // Prevent admin from restricting themselves
  if (userId === adminId) {
    throw new Error('Cannot restrict yourself');
  }

  const updatedUser = await repository.updateUserRestriction(userId, restricted, reason, adminId);
  return updatedUser;
}

async function listAuditLogs(filters) {
  return repository.findAuditLogs(filters);
}

module.exports = {
  listReports,
  updateReportStatus,
  listUsers,
  restrictUser,
  listAuditLogs
};
