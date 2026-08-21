// Prisma queries for Evidence

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EvidenceRepository {
  
  async createEvidence(data) {
    return await prisma.evidence.create({
      data,
    });
  }

  async getEvidenceByBooking(bookingId) {
    return await prisma.evidence.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' }, // Sorts them by oldest to newest
    });
  }
}

module.exports = new EvidenceRepository();