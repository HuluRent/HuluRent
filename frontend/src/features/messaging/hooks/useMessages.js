import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  sendMessage,
} from '../../../api/messaging.api';

export function useMessages(conversationId) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: Boolean(conversationId),
  });

  const sendMutation = useMutation({
    mutationFn: (content) => sendMessage(conversationId, content),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (currentMessages) => {
          if (!currentMessages) return [newMessage];

          return [...currentMessages, newMessage];
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });
    },
  });

  return {
    ...messagesQuery,
    sendMessage: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    sendError: sendMutation.error,
  };
}
