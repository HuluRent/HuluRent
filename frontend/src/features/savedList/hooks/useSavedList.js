import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavedList,
  addSavedListing,
  removeSavedListing,
} from '../../../api/savedList.api';

const SAVED_LIST_KEY = ['savedList'];

/**
 * Returns the authenticated user's saved listings.
 * Only executes when `enabled` is true (i.e. user is authenticated).
 */
export function useSavedList({ enabled = true } = {}) {
  return useQuery({
    queryKey: SAVED_LIST_KEY,
    queryFn: getSavedList,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation to add a listing to the saved list.
 * Invalidates the savedList cache on success.
 */
export function useAddToSavedList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId) => addSavedListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY });
    },
  });
}

/**
 * Mutation to remove a listing from the saved list.
 * Optimistically removes the entry from the cache, rolls back on error.
 */
export function useRemoveFromSavedList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId) => removeSavedListing(listingId),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: SAVED_LIST_KEY });
      const previous = queryClient.getQueryData(SAVED_LIST_KEY);
      queryClient.setQueryData(SAVED_LIST_KEY, (old) =>
        old ? old.filter((entry) => entry.listingId !== listingId) : old
      );
      return { previous };
    },
    onError: (_err, _listingId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(SAVED_LIST_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY });
    },
  });
}
