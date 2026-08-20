import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInspections, scheduleInspection, confirmInspection, cancelInspection, completeInspection } from '../../../api/inspections.api';

export function useInspections(bookingId) {
  return useQuery({
    queryKey: ['inspections', bookingId],
    queryFn: () => getInspections(bookingId),
    enabled: !!bookingId,
  });
}

export function useScheduleInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => scheduleInspection(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inspections', variables.bookingId] });
    },
  });
}

export function useConfirmInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => confirmInspection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
}

export function useCancelInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => cancelInspection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
}

export function useCompleteInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => completeInspection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
}
