const service = require('./listings.service');

async function getById(req, res) {
  const listing = await service.getById(req.params.id);
  return res.json(listing);
}

module.exports = {
  getById,
};
