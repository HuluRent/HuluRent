import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../../../api/listings.api';

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ onUploadProgress, ...listingData }) =>
      createListing(listingData, onUploadProgress),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}
