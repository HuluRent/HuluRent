const repository = require('./listings.repository');

async function getById(id) {
  const listing = await repository.findById(id);

  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    throw error;
  }

  return listing;
}

module.exports = {
  getById,
};
