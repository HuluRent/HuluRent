// Business logic for report resolution, account restriction — calls audit.service on every action

const adminRepo = require('./admin.repository');
const auditService = require('../audit/audit.service');
const { parsePagination } = require('../../shared/utils/pagination');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { BadRequestError } = require('../../shared/errors/BadRequestError');
const logger = require('../../config/logger');

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

    return { id: user.id, email: user.email, role: user.role, restricted };
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
}

module.exports = new AdminService();
