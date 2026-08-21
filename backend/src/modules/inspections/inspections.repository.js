// Prisma queries for Inspection

const { prisma } = require('../../config/database');

const createInspection = async (data) => {
  return prisma.inspection.create({
    data,
    include: { booking: { select: { id: true, ownerId: true, renterId: true } } }
  });
};

const findInspectionById = async (id) => {
  return prisma.inspection.findUnique({
    where: { id },
    include: { booking: { select: { id: true, ownerId: true, renterId: true, itemId: true } } }
  });
};

const findInspectionsByBookingId = async (bookingId) => {
  return prisma.inspection.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'desc' }
  });
};

const updateInspection = async (id, data) => {
  return prisma.inspection.update({
    where: { id },
    data,
    include: { booking: { select: { id: true, ownerId: true, renterId: true } } }
  });
};

/**
 * Bulk-cancel REQUESTED inspections older than the cutoff date.
 * Used by the expire-inspection-requests cron job.
 */
const expireStaleInspections = async (cutoffDate) => {
  return prisma.inspection.updateMany({
    where: {
      status: 'REQUESTED',
      createdAt: { lt: cutoffDate }
    },
    data: { status: 'CANCELLED' }
  });
};

/**
 * Returns [ownerId, renterId] for the booking associated with this inspection.
 * Used by ownershipGuard middleware.
 */
const getInspectionParticipantIds = async (inspectionId) => {
  const inspection = await prisma.inspection.findUnique({
    where: { id: inspectionId },
    select: { booking: { select: { ownerId: true, renterId: true } } }
  });
  return inspection ? [inspection.booking.ownerId, inspection.booking.renterId] : null;
};

module.exports = {
  createInspection,
  findInspectionById,
  findInspectionsByBookingId,
  updateInspection,
  expireStaleInspections,
  getInspectionParticipantIds
};
