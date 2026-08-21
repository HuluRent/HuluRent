// Parses req, calls admin.service, shapes HTTP response

const adminService = require('./admin.service');
const asyncHandler = require('../../shared/utils/async-handler');

const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);

  res.status(200).json({
    success: true,
    data: result
  });
});

const restrictUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { restricted, reason } = req.body;
  const adminId = req.user.userId;

  const result = await adminService.restrictUser(id, { restricted, reason }, adminId);

  res.status(200).json({
    success: true,
    data: result
  });
});

const getReports = asyncHandler(async (req, res) => {
  const result = await adminService.getReports(req.query);

  res.status(200).json({
    success: true,
    data: result
  });
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user.userId;

  const result = await adminService.updateReportStatus(id, status, adminId);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  getUsers,
  restrictUser,
  getReports,
  updateReportStatus
};
