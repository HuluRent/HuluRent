const repository = require('./admin.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

async function listReports(filters) {
  return repository.findReports(filters);
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
