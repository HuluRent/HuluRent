const service = require('./listings.service');
const imageService = require('./listing-images.service');

async function getById(req, res) {
  const listing = await service.getById(req.params.id);
  return res.json(listing);
}

async function list(req, res) {
  const filters = {
    categoryId: req.query.categoryId,
    ownerId: req.query.ownerId,
    status: req.query.status
  };
  const listings = await service.findAll(filters);
  return res.json(listings);
}

async function create(req, res) {
  const imageUrls = await imageService.uploadImages(req.files || []);
  
  const listingData = {
    ...req.body,
    ownerId: req.user.userId,
    status: 'PUBLISHED'
  };

  const newListing = await service.create(listingData, imageUrls);
  return res.status(201).json(newListing);
}

async function update(req, res) {
  const updatedListing = await service.update(req.params.id, req.body);
  return res.json(updatedListing);
}

async function remove(req, res) {
  await service.remove(req.params.id);
  return res.status(204).send();
}

module.exports = {
  getById,
  list,
  create,
  update,
  remove
};
