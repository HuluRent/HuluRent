import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startConversation } from '../../../api/messaging.api';

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId) => startConversation(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
