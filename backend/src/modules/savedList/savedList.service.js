const repository = require('./savedList.repository');
const { prisma } = require('../../config/database');
const { ConflictError } = require('../../shared/errors/ConflictError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

async function getSavedList(userId) {
  return repository.findAllByUser(userId);
}

async function addToSavedList(userId, listingId) {
  // Verify listing exists
  const listing = await prisma.item.findUnique({
    where: { id: listingId },
    select: { id: true },
  });
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const alreadySaved = await repository.exists(userId, listingId);
  if (alreadySaved) {
    throw new ConflictError('Listing is already saved');
  }

  return repository.create(userId, listingId);
}

async function removeFromSavedList(userId, listingId) {
  const savedEntry = await repository.exists(userId, listingId);
  if (!savedEntry) {
    throw new NotFoundError('Saved listing not found');
  }
  return repository.remove(userId, listingId);
}

module.exports = { getSavedList, addToSavedList, removeFromSavedList };
