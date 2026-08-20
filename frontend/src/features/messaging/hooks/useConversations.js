import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../../../api/messaging.api';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
}
