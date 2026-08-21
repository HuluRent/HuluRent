import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../../api/users.api';

export function usePublicProfile(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
}
