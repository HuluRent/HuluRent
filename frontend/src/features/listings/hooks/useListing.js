import { useQuery } from '@tanstack/react-query';
import { getListing } from '../../../api/listings.api';

export function useListing(itemId) {
  return useQuery({
    queryKey: ['listing', itemId],
    queryFn: () => getListing(itemId),
    enabled: !!itemId,
  });
}
