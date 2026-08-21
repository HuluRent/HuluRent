// Business logic — generate agreement from template, record acceptance, versioning

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const agreementsRepository = require('./agreements.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { ForbiddenError } = require('../../shared/errors/ForbiddenError');

class AgreementsService {
  
  /**
   * Generates a new agreement when a booking is confirmed
   */
  async generateAgreement(bookingId, termsText) {
    // Check if one already exists to prevent duplicates
    const existing = await agreementsRepository.findByBookingId(bookingId);
    if (existing) {
      throw new ValidationError('An agreement already exists for this booking');
    }

    return await agreementsRepository.createAgreement({
      bookingId,
      terms: termsText,
    });
  }

  /**
   * Handles a user digitally signing the agreement
   */
  async signAgreement(bookingId, userId) {
    const agreement = await agreementsRepository.findByBookingId(bookingId);
    
    if (!agreement) {
      throw new NotFoundError('Agreement not found');
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const updateData = {};
    if (booking.ownerId === userId) {
      if (agreement.ownerAccepted) throw new ValidationError('Owner has already signed');
      updateData.ownerAccepted = true;
    } else if (booking.renterId === userId) {
      if (agreement.renterAccepted) throw new ValidationError('Renter has already signed');
      updateData.renterAccepted = true;
    } else {
      throw new ForbiddenError('You are not a participant in this booking');
    }

    return await agreementsRepository.updateSignature(agreement.id, updateData);
  }
}

module.exports = new AgreementsService();