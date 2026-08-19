const service = require('./notifications.service');

async function list(req, res) {
  const unreadOnly = req.query.unread === 'true';
  const notifications = await service.getUserNotifications(req.user.userId, unreadOnly);
  return res.json(notifications);
}

async function markRead(req, res) {
  await service.readNotification(req.params.id, req.user.userId);
  return res.status(204).send();
}

async function markAllRead(req, res) {
  await service.readAllNotifications(req.user.userId);
  return res.status(204).send();
}

module.exports = {
  list,
  markRead,
  markAllRead
};
