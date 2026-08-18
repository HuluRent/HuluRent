const service = require('./categories.service');

async function list(req, res) {
  const categories = await service.getAllCategories();
  return res.status(200).json(categories);
}

async function create(req, res) {
  const category = await service.createCategory(req.body);
  return res.status(201).json(category);
}

async function update(req, res) {
  const category = await service.updateCategory(req.params.id, req.body);
  return res.status(200).json(category);
}

module.exports = { list, create, update };
