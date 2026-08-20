import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { AuditLogTable } from '../components/AuditLogTable';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const params = { page, limit: 20 };
  if (debouncedSearch) params.q = debouncedSearch;

  const { data, isLoading, isError } = useAdminUsers(params);
  const users = data?.items || [];
  const total = data?.total || 0;

  if (isLoading) return <LoadingSpinner label="Loading users…" />;
  if (isError) return <EmptyState icon="error" title="Failed to load" description="Could not load users." />;

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">User Management</h1>

      <AuditLogTable
        users={users}
        searchQuery={search}
        onSearchChange={(q) => { setSearch(q); setPage(1); }}
      />

      {total > 20 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={Math.ceil(total / 20)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
