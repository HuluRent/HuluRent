import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../../../api/bookings.api';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
    },
  });
}
