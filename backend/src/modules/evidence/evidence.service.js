// Business logic for evidence submission, acknowledgement, ownership checks

const evidenceRepository = require('./evidence.repository');
const { ValidationError } = require('../../shared/errors/ValidationError');

class EvidenceService {
  
  /**
   * Records a new piece of photographic evidence
   */
  async submitEvidence({ bookingId, uploaderId, role, photoUrl, stage }) {
    
    // 1. Validate the stage type
    const validStages = ['PICKUP', 'RETURN'];
    if (!validStages.includes(stage)) {
      throw new ValidationError('Invalid evidence stage. Must be PICKUP or RETURN.');
    }

    // 2. Pass the clean data to the repository
    const newEvidence = await evidenceRepository.createEvidence({
      bookingId,
      uploaderId,
      role,       // 'OWNER' or 'RENTER'
      stage,      // 'PICKUP' or 'RETURN'
      photoUrl,   // e.g., '/uploads/camera-front.jpg'
    });

    return newEvidence;
  }

  /**
   * Retrieves all evidence for a booking
   */
  async viewEvidence(bookingId) {
    return await evidenceRepository.getEvidenceByBooking(bookingId);
  }
}

module.exports = new EvidenceService();