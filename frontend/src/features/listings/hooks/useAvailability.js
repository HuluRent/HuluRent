// Query + mutations for availability windows. Lives alongside the other
// listings hooks — availability is a property of an item, even though
// it's also consumed read-only from the bookings feature (see
// AvailabilityCalendar.jsx and ARCHITECTURE.md §4.2's note on that reuse).

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAvailability, createAvailability, deleteAvailability } from '../../../api/availability.api';

export function useAvailability(itemId) {
  return useQuery({
    queryKey: ['availability', itemId],
    queryFn: () => getAvailability(itemId),
    enabled: !!itemId,
  });
}

export function useCreateAvailability(itemId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', itemId] });
    },
  });
}

export function useDeleteAvailability(itemId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', itemId] });
    },
  });
}