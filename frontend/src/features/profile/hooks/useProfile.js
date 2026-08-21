import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateMyProfile } from '../../../api/users.api';

export function usePublicProfile(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
}


export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      return data;
    },
  });
}
