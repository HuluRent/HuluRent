const service = require('./reports.service');

async function create(req, res) {
  const report = await service.fileReport(req.user.userId, req.body);
  return res.status(201).json(report);
}

async function list(req, res) {
  const filters = {
    status: req.query.status,
    authorId: req.query.authorId
  };
  const reports = await service.getReports(filters);
  return res.json(reports);
}

async function updateStatus(req, res) {
  const updatedReport = await service.updateReportStatus(req.params.id, req.body.status);
  return res.json(updatedReport);
}

module.exports = {
  create,
  list,
  updateStatus
};
