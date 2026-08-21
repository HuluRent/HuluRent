const logger = require('../../config/logger');

async function expireInspectionRequests() {
  logger.info('Running cron job: Expiring stale inspection requests...');
}

module.exports = expireInspectionRequests;
