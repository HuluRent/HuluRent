import { useState } from 'react';
import { useAdminReports } from '../hooks/useAdminReports';
import { ModerationQueue } from '../components/ModerationQueue';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';

export default function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(undefined);

  const params = { page, limit: 20 };
  if (statusFilter) params.status = statusFilter;

  const { data, isLoading, isError } = useAdminReports(params);
  const reports = data?.items || [];
  const total = data?.total || 0;

  if (isLoading) return <LoadingSpinner label="Loading reports…" />;
  if (isError) return <EmptyState icon="error" title="Failed to load" description="Could not load reports." />;

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Reports Moderation</h1>

      <ModerationQueue
        reports={reports}
        statusFilter={statusFilter}
        onFilterChange={(s) => { setStatusFilter(s); setPage(1); }}
      />

      {total > 20 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={Math.ceil(total / 20)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
