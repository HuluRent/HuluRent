// Prisma queries for Evidence
// TODO: implement
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EvidenceRepository {
  
  // 1. Save a new photo record to the database
  async createEvidence(data) {
    return await prisma.evidence.create({
      data,
    });
  }

  // 2. Fetch all evidence photos for a specific booking (useful for disputes)
  async getEvidenceByBooking(bookingId) {
    return await prisma.evidence.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' }, // Sorts them by oldest to newest
    });
  }
}

module.exports = new EvidenceRepository();