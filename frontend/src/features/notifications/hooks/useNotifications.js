import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../../../api/notifications.api';

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  });
}

export function useUnreadCount() {
  const { data } = useNotifications({ limit: 100 });
  const items = data?.items || [];
  return items.filter((n) => !n.readAt).length;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
