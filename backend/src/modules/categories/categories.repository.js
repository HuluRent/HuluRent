const { prisma } = require('../../config/database');

async function findAll() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

async function create(data) {
  return await prisma.category.create({ data });
}

async function update(id, data) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

module.exports = { findAll, create, update };
