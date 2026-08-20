import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../../../api/messaging.api';

export function useMessages(bookingId, params = {}) {
  return useQuery({
    queryKey: ['messages', bookingId, params],
    queryFn: () => getMessages(bookingId, params),
    enabled: !!bookingId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, content }) => sendMessage(bookingId, content),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
