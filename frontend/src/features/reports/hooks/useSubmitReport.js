import { useMutation } from '@tanstack/react-query';
import { submitReport } from '../../../api/reports.api';

export function useSubmitReport() {
  return useMutation({
    mutationFn: ({ subjectId, reason, details }) =>
      submitReport({ subjectId, reason, details }),
  });
}
