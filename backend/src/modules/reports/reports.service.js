const reportsRepo = require('./reports.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

async function fileReport(authorId, data) {
  return reportsRepo.create({
    authorId,
    subjectId: data.subjectId,
    reason: data.reason,
    details: data.details
  });
}

async function getReports(filters) {
  return reportsRepo.findAll(filters);
}

async function updateReportStatus(reportId, status) {
  const report = await reportsRepo.findById(reportId);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  let resolvedAt = null;
  if (status === 'RESOLVED' || status === 'DISMISSED') {
    resolvedAt = new Date();
  }

  return reportsRepo.updateStatus(reportId, status, resolvedAt);
}

module.exports = {
  fileReport,
  getReports,
  updateReportStatus
};
