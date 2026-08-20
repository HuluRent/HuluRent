import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadEvidence, getEvidence, acknowledgeEvidence } from '../../../api/evidence.api';

export function useEvidence(bookingId) {
  return useQuery({
    queryKey: ['evidence', bookingId],
    queryFn: () => getEvidence(bookingId),
    enabled: !!bookingId,
  });
}

export function useUploadEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => uploadEvidence(formData),
    onSuccess: (_, formData) => {
      const bookingId = formData.get('bookingId');
      if (bookingId) {
        queryClient.invalidateQueries({ queryKey: ['evidence', bookingId] });
      }
    },
  });
}

export function useAcknowledgeEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => acknowledgeEvidence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}
