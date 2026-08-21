// Parses req, calls audit.service, shapes HTTP response for admin audit log viewing.

const auditService = require('./audit.service');
const asyncHandler = require('../../shared/utils/async-handler');

const getAuditLog = asyncHandler(async (req, res) => {
  const result = await auditService.getAuditLog(req.query);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  getAuditLog
};
