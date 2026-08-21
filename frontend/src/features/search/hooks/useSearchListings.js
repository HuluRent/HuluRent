// useQuery wrapping search.api.js. Keyed on the full filters object so
// changing any filter (or page) triggers a refetch and gets its own
// cache entry — moving back to a previous filter/page combo is instant.
//
// Backend returns { data: [...], meta: { total, page, limit, totalPages } }.
// We normalise that to { items, total, page, limit } so every consumer
// can use a single stable shape.

import { useQuery } from '@tanstack/react-query';
import { searchListings } from '../../../api/search.api';

function normalise(raw) {
  if (!raw) return raw;
  // already normalised (shouldn't happen, but be safe)
  if (Array.isArray(raw.items)) return raw;
  return {
    items: raw.data ?? [],
    total: raw.meta?.total ?? 0,
    page: raw.meta?.page ?? 1,
    limit: raw.meta?.limit ?? 20,
  };
}

export function useSearchListings(filters) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchListings(filters).then(normalise),
    keepPreviousData: true, // avoids a loading flash when only the page changes
  });
}