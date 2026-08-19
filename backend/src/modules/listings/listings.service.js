const repository = require('./listings.repository');
const { NotFoundError } = require('../../shared/errors/NotFoundError');

async function getById(id) {
  const listing = await repository.findById(id);

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  return listing;
}

async function findAll(filters) {
  return repository.findAll(filters);
}

async function create(data, imageUrls) {
  return repository.create(data, imageUrls);
}

async function update(id, data) {
  const listing = await repository.findById(id);
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }
  return repository.update(id, data);
}

async function remove(id) {
  const listing = await repository.findById(id);
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }
  return repository.remove(id);
}

module.exports = {
  getById,
  findAll,
  create,
  update,
  remove
};
