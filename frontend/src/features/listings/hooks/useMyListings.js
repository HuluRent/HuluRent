// useQuery for the current owner's listings — all statuses, including
// DRAFT (the public search/detail endpoints never return DRAFT to
// non-owners, but this one always shows everything the caller owns).

import { useQuery } from '@tanstack/react-query';
import { getMyListings } from '../../../api/listings.api';

export function useMyListings(page = 1) {
  return useQuery({
    queryKey: ['my-listings', page],
    queryFn: () => getMyListings({ page }),
    keepPreviousData: true,
  });
}