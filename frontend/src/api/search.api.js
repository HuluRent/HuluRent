// Thin wrapper around client.js for the search backend module.
// Response shape is documented in hulurent-docs' technical/api-reference.md
// "Search" section (including the owner rating/category fields added
// specifically for the browse-listings page).

import { client } from './client';

export function searchListings(filters = {}) {
  const params = {};
  if (filters.query) params.q = filters.query;
  if (filters.categoryIds?.length) params.categoryId = filters.categoryIds.join(',');
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.location) params.location = filters.location;
  if (filters.verifiedOnly) params.verifiedOnly = 'true';
  if (filters.sort) params.sort = filters.sort;
  params.page = filters.page ?? 1;
  params.limit = filters.limit ?? 20;

  return client.get('/search', { params }).then((res) => res.data);
}