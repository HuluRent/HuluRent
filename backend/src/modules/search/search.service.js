const searchRepo = require('./search.repository');

async function searchItems(queryFilters) {
  const {
    q,
    categoryId,
    minPrice,
    maxPrice,
    status = 'PUBLISHED', // Default to only showing published items to public
    minLat,
    maxLat,
    minLng,
    maxLng,
    page,
    limit
  } = queryFilters;

  const where = { status };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerUnit = {};
    if (minPrice !== undefined) where.pricePerUnit.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerUnit.lte = maxPrice;
  }

  // Simple Bounding Box geospatial filter
  if (minLat !== undefined && maxLat !== undefined && minLng !== undefined && maxLng !== undefined) {
    where.latitude = { gte: minLat, lte: maxLat };
    where.longitude = { gte: minLng, lte: maxLng };
  }

  const skip = (page - 1) * limit;
  
  return searchRepo.findItems(where, skip, limit);
}

module.exports = {
  searchItems
};
