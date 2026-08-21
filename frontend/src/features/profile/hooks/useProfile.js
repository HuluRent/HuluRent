import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
} from '../../../api/users.api';

function normalizeProfile(data) {
  if (!data) return data;

  return {
    ...data,
    ...(data.profile || {}),
    profile: data.profile || null,
  };
}

export function usePublicProfile(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const data = await getUserProfile(userId);
      return normalizeProfile(data);
    },
    enabled: Boolean(userId),
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const data = await getMyProfile();
      return normalizeProfile(data);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      const normalized = normalizeProfile(data);

      queryClient.setQueryData(['profile', normalized.id], normalized);
      queryClient.setQueryData(['profile', 'me'], normalized);

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      return normalized;
    },
  });
}
