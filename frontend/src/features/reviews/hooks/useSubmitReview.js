import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitReview, getUserReviews } from '../../../api/reviews.api';

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, rating, comment }) =>
      submitReview({ bookingId, rating, comment }),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUserReviews(userId, params = {}) {
  return useQuery({
    queryKey: ['reviews', userId, params],
    queryFn: () => getUserReviews(userId, params),
    enabled: !!userId,
  });
}
