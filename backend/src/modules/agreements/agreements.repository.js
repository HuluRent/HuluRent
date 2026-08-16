// Prisma queries for RentalAgreement

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgreementsRepository {
  // 1. Create a brand new agreement linked to a specific booking
  async createAgreement(data) {
    return await prisma.agreement.create({
      data,
    });
  }

  // 2. Find an agreement using the booking ID
  async findByBookingId(bookingId) {
    return await prisma.agreement.findUnique({
      where: { bookingId },
    });
  }

  // 3. Update the agreement when a user signs it
  async updateSignature(agreementId, updateData) {
    return await prisma.agreement.update({
      where: { id: agreementId },
      data: updateData,
    });
  }
}

module.exports = new AgreementsRepository();