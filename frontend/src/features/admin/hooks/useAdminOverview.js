// Dashboard summary counts. No dedicated "stats" endpoint exists in
// api-reference.md — deliberately not adding one for a P2 page. Instead
// this reads the `total` field off the existing paginated list endpoints
// (limit: 1, since only the count is needed, not the items).

import { useQuery } from '@tanstack/react-query';
import { getReports, getUsers } from '../../../api/admin.api';

export function useAdminOverview() {
  const openReports = useQuery({
    queryKey: ['admin', 'reports', 'count', 'OPEN'],
    queryFn: () => getReports({ status: 'OPEN', page: 1, limit: 1 }),
  });

  const totalUsers = useQuery({
    queryKey: ['admin', 'users', 'count'],
    queryFn: () => getUsers({ page: 1, limit: 1 }),
  });

  return {
    openReportsCount: openReports.data?.total,
    totalUsersCount: totalUsers.data?.total,
    isLoading: openReports.isLoading || totalUsers.isLoading,
    isError: openReports.isError || totalUsers.isError,
  };
}