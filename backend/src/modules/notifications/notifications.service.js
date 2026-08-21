const notificationsRepo = require('./notifications.repository');

async function notifyUser(userId, type, payload) {
  return notificationsRepo.create(userId, type, payload);
}

async function getUserNotifications(userId, unreadOnly) {
  return notificationsRepo.findByUserId(userId, unreadOnly);
}

async function readNotification(notificationId, userId) {
  return notificationsRepo.markAsRead(notificationId, userId);
}

async function readAllNotifications(userId) {
  return notificationsRepo.markAllAsRead(userId);
}

module.exports = {
  notifyUser,
  getUserNotifications,
  readNotification,
  readAllNotifications
};
