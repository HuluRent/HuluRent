const logger = require('../config/logger');

async function expirePendingBookings() {
  logger.info('Running cron job: Expiring pending bookings...');
}

module.exports = expirePendingBookings;
