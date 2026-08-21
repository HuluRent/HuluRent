const expireInspectionRequests = require('./expire-inspection-requests.job');
const expirePendingBookings = require('./expire-pending-bookings.job');
const logger = require('../config/logger');

// Dummy scheduler setup, typically you'd use node-cron or similar here
function initScheduler() {
  logger.info('Initializing background jobs scheduler...');
  
  // Set intervals as a placeholder for a real cron scheduler (e.g., every 1 hour)
  setInterval(() => {
    expireInspectionRequests().catch(err => logger.error('Error in expireInspectionRequests job', { err }));
  }, 1000 * 60 * 60);

  setInterval(() => {
    expirePendingBookings().catch(err => logger.error('Error in expirePendingBookings job', { err }));
  }, 1000 * 60 * 60);
}

module.exports = { initScheduler };
