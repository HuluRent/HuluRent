const service = require('./savedList.service');

async function list(req, res) {
  const savedListings = await service.getSavedList(req.user.userId);
  return res.json(savedListings);
}

async function add(req, res) {
  const { listingId } = req.body;
  const entry = await service.addToSavedList(req.user.userId, listingId);
  return res.status(201).json(entry);
}

async function remove(req, res) {
  const { listingId } = req.params;
  await service.removeFromSavedList(req.user.userId, listingId);
  return res.status(204).send();
}

module.exports = { list, add, remove };
