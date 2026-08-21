const service = require('./admin.service');

async function listReports(req, res) {
  const result = await service.listReports({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    status: req.query.status
  });
  res.json(result);
}

async function updateReportStatus(req, res) {
  const result = await service.updateReportStatus(
    req.params.id,
    req.body.status,
    req.user.userId
  );
  res.json(result);
}

async function listUsers(req, res) {
  const result = await service.listUsers({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    q: req.query.q
  });
  res.json(result);
}

async function restrictUser(req, res) {
  const result = await service.restrictUser(
    req.params.id,
    req.body.restricted,
    req.body.reason,
    req.user.userId
  );
  res.json(result);
}

async function listAuditLogs(req, res) {
  const result = await service.listAuditLogs({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 50
  });
  res.json(result);
}

module.exports = {
  listReports,
  updateReportStatus,
  listUsers,
  restrictUser,
  listAuditLogs
};
