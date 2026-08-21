const searchRepo = require('./search.repository');

async function searchItems(queryFilters) {
  const {
    q,
    categoryId,
    location,
    minPrice,
    maxPrice,
    minLat,
    maxLat,
    minLng,
    maxLng,
    page,
    limit
  } = queryFilters;

  const where = { status: 'PUBLISHED', AND: [] };

  if (categoryId) {
    const ids = categoryId.split(',').map(id => id.trim()).filter(Boolean);
    if (ids.length > 0) {
      where.AND.push({
        OR: [
          { categoryId: { in: ids } },
          { category: { parentId: { in: ids } } },
        ]
      });
    }
  }

  // Text search across name and description
  if (q) {
    const tokens = q.trim().split(/\s+/).filter(Boolean);
    if (tokens.length > 0) {
      const tokenConditions = tokens.map(token => ({
        OR: [
          { name: { contains: token, mode: 'insensitive' } },
          { description: { contains: token, mode: 'insensitive' } },
          { category: { name: { contains: token, mode: 'insensitive' } } }
        ]
      }));
      where.AND.push(...tokenConditions);
    }
  }
  // Location is a separate AND condition — narrows results to a specific area
  if (location) {
    where.approxLocation = { contains: location, mode: 'insensitive' };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCondition = {};
    if (minPrice !== undefined) priceCondition.gte = minPrice;
    if (maxPrice !== undefined) priceCondition.lte = maxPrice;
    where.AND.push({ pricePerUnit: priceCondition });
  }

  // Simple Bounding Box geospatial filter
  if (minLat !== undefined && maxLat !== undefined && minLng !== undefined && maxLng !== undefined) {
    where.AND.push({
      latitude: { gte: minLat, lte: maxLat },
      longitude: { gte: minLng, lte: maxLng }
    });
  }

  if (where.AND.length === 0) {
    delete where.AND;
  }

  const skip = (page - 1) * limit;

  return searchRepo.findItems(where, skip, limit);
}

module.exports = {
  searchItems
};
