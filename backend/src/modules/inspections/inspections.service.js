// Business logic for inspection scheduling/status transitions

const { prisma } = require('../../config/database');
const { INSPECTION_STATES, VALID_TRANSITIONS } = require('../../shared/constants/inspection-states');
const inspectionRepo = require('./inspections.repository');
const auditService = require('../audit/audit.service');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { BadRequestError } = require('../../shared/errors/BadRequestError');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');
const logger = require('../../config/logger');

class InspectionsService {

  /**
   * Schedule a new inspection for a booking.
   * Either the owner or renter may request one.
   */
  async scheduleInspection({ bookingId, scheduledAt, notes, userId }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, ownerId: true, renterId: true, status: true }
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      const isParticipant = booking.ownerId === userId || booking.renterId === userId;
      if (!isParticipant) {
        throw new ForbiddenError('Only booking participants can schedule inspections');
      }

      const inspection = await tx.inspection.create({
        data: {
          bookingId,
          scheduledAt: new Date(scheduledAt),
          status: INSPECTION_STATES.REQUESTED,
          notes: notes || null
        },
        include: { booking: { select: { id: true, ownerId: true, renterId: true } } }
      });

      auditService.log({
        actorId: userId,
        action: 'INSPECTION_SCHEDULED',
        entityType: 'Inspection',
        entityId: inspection.id,
        metadata: { bookingId, scheduledAt }
      });

      return inspection;
    });
  }

  /**
   * Confirm a REQUESTED inspection. Only booking participants may confirm.
   */
  async confirmInspection(inspectionId, userId) {
    const inspection = await inspectionRepo.findInspectionById(inspectionId);
    if (!inspection) {
      throw new NotFoundError('Inspection not found');
    }

    this._assertParticipant(inspection.booking, userId);
    this._assertValidTransition(inspection.status, INSPECTION_STATES.CONFIRMED);

    const updated = await inspectionRepo.updateInspection(inspectionId, {
      status: INSPECTION_STATES.CONFIRMED
    });

    auditService.log({
      actorId: userId,
      action: 'INSPECTION_CONFIRMED',
      entityType: 'Inspection',
      entityId: inspectionId,
      metadata: { bookingId: inspection.bookingId }
    });

    return updated;
  }

  /**
   * Mark a CONFIRMED inspection as COMPLETED. Only the booking owner may complete.
   */
  async completeInspection(inspectionId, userId) {
    const inspection = await inspectionRepo.findInspectionById(inspectionId);
    if (!inspection) {
      throw new NotFoundError('Inspection not found');
    }

    if (inspection.booking.ownerId !== userId) {
      throw new ForbiddenError('Only the item owner can complete an inspection');
    }

    this._assertValidTransition(inspection.status, INSPECTION_STATES.COMPLETED);

    const updated = await inspectionRepo.updateInspection(inspectionId, {
      status: INSPECTION_STATES.COMPLETED
    });

    auditService.log({
      actorId: userId,
      action: 'INSPECTION_COMPLETED',
      entityType: 'Inspection',
      entityId: inspectionId,
      metadata: { bookingId: inspection.bookingId }
    });

    return updated;
  }

  /**
   * Cancel a REQUESTED or CONFIRMED inspection. Either participant may cancel.
   */
  async cancelInspection(inspectionId, userId) {
    const inspection = await inspectionRepo.findInspectionById(inspectionId);
    if (!inspection) {
      throw new NotFoundError('Inspection not found');
    }

    this._assertParticipant(inspection.booking, userId);
    this._assertValidTransition(inspection.status, INSPECTION_STATES.CANCELLED);

    const updated = await inspectionRepo.updateInspection(inspectionId, {
      status: INSPECTION_STATES.CANCELLED
    });

    auditService.log({
      actorId: userId,
      action: 'INSPECTION_CANCELLED',
      entityType: 'Inspection',
      entityId: inspectionId,
      metadata: { bookingId: inspection.bookingId }
    });

    return updated;
  }

  /**
   * Get all inspections for a booking.
   */
  async getInspectionsByBookingId(bookingId) {
    return inspectionRepo.findInspectionsByBookingId(bookingId);
  }

  // ── Private helpers ────────────────────────────────────────────────

  _assertParticipant(booking, userId) {
    const isParticipant = booking.ownerId === userId || booking.renterId === userId;
    if (!isParticipant) {
      throw new ForbiddenError('Only booking participants can perform this action');
    }
  }

  _assertValidTransition(currentStatus, targetStatus) {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      throw new BadRequestError(
        `Cannot transition inspection from ${currentStatus} to ${targetStatus}`
      );
    }
  }
}

module.exports = new InspectionsService();
