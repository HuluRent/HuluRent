import { useQuery } from '@tanstack/react-query';
import { getBookingDetails } from '../../../api/bookings.api';

export function useBooking(bookingId) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingDetails(bookingId),
    enabled: !!bookingId,
  });
}
