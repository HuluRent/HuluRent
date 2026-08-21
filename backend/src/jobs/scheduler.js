const expireInspectionRequests = require('./expire-inspection-requests.job');
const expirePendingBookings = require('./expire-pending-bookings.job');
const logger = require('../config/logger');

function initScheduler() {
  logger.info('Initializing background jobs scheduler...');
  
  setInterval(() => {
    expireInspectionRequests().catch(err => logger.error('Error in expireInspectionRequests job', { err }));
  }, 1000 * 60 * 60);

  setInterval(() => {
    expirePendingBookings().catch(err => logger.error('Error in expirePendingBookings job', { err }));
  }, 1000 * 60 * 60);
}

module.exports = { initScheduler };
