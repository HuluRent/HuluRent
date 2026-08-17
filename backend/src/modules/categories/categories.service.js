const repository = require('./categories.repository');

async function getAllCategories() {
  return await repository.findAll();
}

async function createCategory(data) {
  if (!data.slug) {
    data.slug = data.name.toLowerCase().replace(/[\s_]+/g, '-');
  }
  return await repository.create(data);
}

async function updateCategory(id, data) {
  return await repository.update(id, data);
}

module.exports = { getAllCategories, createCategory, updateCategory };
