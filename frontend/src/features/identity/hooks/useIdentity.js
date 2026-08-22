import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getIdentityVerificationStatus,
  initiateIdentityVerification,
  verifyIdentity,
} from '../../../api/identity.api';

export function useIdentityVerificationStatus() {
  return useQuery({
    queryKey: ['identity-status'],
    queryFn: getIdentityVerificationStatus,
  });
}

export function useInitiateIdentityVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idNumber) => initiateIdentityVerification(idNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-status'] });
    },
  });
}

export function useVerifyIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idNumber, otp }) => verifyIdentity(idNumber, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-status'] });
    },
  });
}
