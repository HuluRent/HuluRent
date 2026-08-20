import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminReports, updateReportStatus } from '../../../api/admin.api';

export function useAdminReports(params = {}) {
  return useQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: () => getAdminReports(params),
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateReportStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}
