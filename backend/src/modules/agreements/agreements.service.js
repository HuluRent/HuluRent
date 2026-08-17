// Business logic — generate agreement from template, record acceptance, versioning
// TODO: implement
const agreementsRepository = require('./agreements.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { ValidationError } = require('../../shared/errors/ValidationError');

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
      ownerSignedAt: null,
      renterSignedAt: null,
    });
  }

  /**
   * Handles a user digitally signing the agreement
   */
  async signAgreement(bookingId, userId, role) {
    const agreement = await agreementsRepository.findByBookingId(bookingId);
    
    if (!agreement) {
      throw new NotFoundError('Agreement not found');
    }

    // Determine which signature field to update based on the user's role
    const updateData = {};
    if (role === 'OWNER') {
      if (agreement.ownerSignedAt) throw new ValidationError('Owner has already signed');
      updateData.ownerSignedAt = new Date();
    } else if (role === 'RENTER') {
      if (agreement.renterSignedAt) throw new ValidationError('Renter has already signed');
      updateData.renterSignedAt = new Date();
    } else {
      throw new ValidationError('Invalid role for signing');
    }

    return await agreementsRepository.updateSignature(agreement.id, updateData);
  }
}

module.exports = new AgreementsService();