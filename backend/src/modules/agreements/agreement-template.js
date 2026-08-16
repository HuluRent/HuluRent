// Builds agreement terms JSON from booking data, includes the off-platform-handoff clause (hulurent-docs product/trust-and-liability.md §1)
// Builds agreement terms JSON from booking data, includes the off-platform-handoff clause (hulurent-docs product/tr...)

const buildAgreementTemplate = (bookingData, itemData, ownerData, renterData) => {
  return {
    documentType: "HuluRent Standard Rental Agreement",
    generatedAt: new Date().toISOString(),
    parties: {
      owner: { id: ownerData.id, name: ownerData.name },
      renter: { id: renterData.id, name: renterData.name }
    },
    bookingDetails: {
      bookingId: bookingData.id,
      itemId: itemData.id,
      rentalPeriod: {
        start: bookingData.startDate,
        end: bookingData.endDate
      },
      totalCost: bookingData.totalPrice
    },
    clauses: [
      {
        section: "1. Usage Terms",
        content: "The renter agrees to use the rental item carefully and exclusively for its intended purpose."
      },
      {
        section: "2. Off-Platform Handoff Clause",
        content: "Both parties agree to conduct the physical exchange of the item in a safe, public location. Both parties acknowledge that HuluRent facilitates the digital booking but is not liable for any physical incidents during the off-platform handoff. Both parties must document the item's condition at the time of exchange."
      },
      {
        section: "3. Return & Damage Policy",
        content: "The item must be returned in the condition it was received, subject to normal wear and tear. The renter is liable for unauthorized modifications or damage."
      }
    ],
    status: "PENDING_SIGNATURE"
  };
};

module.exports = {
  buildAgreementTemplate
};
