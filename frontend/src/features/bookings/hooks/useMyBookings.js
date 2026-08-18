import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../../../api/bookings.api';

export function useMyBookings(role) {
  return useQuery({
    queryKey: ['bookings', 'mine', role],
    queryFn: () => getMyBookings({ role }),
  });
}
