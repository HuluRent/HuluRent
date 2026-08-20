import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, restrictUser } from '../../../api/admin.api';

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsers(params),
  });
}

export function useRestrictUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, restricted, reason }) =>
      restrictUser(id, { restricted, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
