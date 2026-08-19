// useMutation for creating a listing. Invalidates 'my-listings' so the
// owner's management page reflects the new listing immediately without
// a manual refetch.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../../../api/listings.api';

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}