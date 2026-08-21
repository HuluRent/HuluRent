// Prisma queries for RentalAgreement

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgreementsRepository {
  async createAgreement(data) {
    return await prisma.rentalAgreement.create({
      data,
    });
  }

  async findByBookingId(bookingId) {
    return await prisma.rentalAgreement.findFirst({
      where: { bookingId },
      orderBy: { version: 'desc' }
    });
  }

  async updateSignature(agreementId, updateData) {
    return await prisma.rentalAgreement.update({
      where: { id: agreementId },
      data: updateData,
    });
  }
}

module.exports = new AgreementsRepository();