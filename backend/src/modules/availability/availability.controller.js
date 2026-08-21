const service = require('./availability.service');

async function getByItemId(req, res) {
  const availability = await service.getByItemId(req.params.itemId);
  return res.json(availability);
}

async function create(req, res) {
  const { itemId, startDate, endDate } = req.body;

  const availability = await service.create(
    itemId,
    startDate,
    endDate
  );

  return res.status(201).json(availability);
}

async function remove(req, res) {
  await service.remove(req.params.id);
  return res.status(204).send();
}

module.exports = {
  getByItemId,
  create,
  remove,
};
