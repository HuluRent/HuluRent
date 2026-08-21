const logger = require('../config/logger');
const { expireStaleInspections } = require('../modules/inspections/inspections.repository');
const { INSPECTION_EXPIRY_HOURS } = require('../shared/constants/inspection-states');

async function expireInspectionRequests() {
  logger.info('Running cron job: Expiring stale inspection requests...');

  try {
    const cutoffDate = new Date(Date.now() - INSPECTION_EXPIRY_HOURS * 60 * 60 * 1000);
    const result = await expireStaleInspections(cutoffDate);

    logger.info(`Expired ${result.count} stale inspection request(s)`, {
      cutoffDate: cutoffDate.toISOString(),
      expiredCount: result.count
    });
  } catch (error) {
    logger.error('Failed to expire stale inspection requests', { error: error.message });
  }
}

module.exports = expireInspectionRequests;
