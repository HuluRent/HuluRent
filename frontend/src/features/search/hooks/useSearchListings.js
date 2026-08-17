// useQuery wrapping search.api.js. Keyed on the full filters object so
// changing any filter (or page) triggers a refetch and gets its own
// cache entry — moving back to a previous filter/page combo is instant.

import { useQuery } from '@tanstack/react-query';
import { searchListings } from '../../../api/search.api';

export function useSearchListings(filters) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchListings(filters),
    keepPreviousData: true, // avoids a loading flash when only the page changes
  });
}