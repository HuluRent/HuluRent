import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../../../api/messaging.api';

export function useMessages(conversationId, params = {}) {
  return useQuery({
    queryKey: ['messages', conversationId, params],
    queryFn: () => getMessages(conversationId, params),
    enabled: !!conversationId,
    // Keep previous data visible while new page loads
    placeholderData: (prev) => prev,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
