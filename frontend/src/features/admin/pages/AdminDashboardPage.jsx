// Admin overview — landing page after RoleGuard confirms role: "ADMIN"
// (router.jsx). Two summary cards + quick links into the fuller admin
// pages (AdminReportsPage / AdminUsersPage — separate issues, FE-31/FE-32,
// not yet built; the links below will 404 into stub pages until then,
// which is expected, not a bug in this page).

import { Link } from 'react-router-dom';
import { useAdminOverview } from '../hooks/useAdminOverview';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

function StatCard({ icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-subtle hover:shadow-hover transition-all flex items-center gap-4"
    >
      <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
      <div>
        <p className="font-headline-lg text-headline-lg text-on-surface">{value}</p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      </div>
    </Link>
  );
}

export function AdminDashboardPage() {
  const { openReportsCount, totalUsersCount, isLoading, isError } = useAdminOverview();

  if (isLoading) return <LoadingSpinner label="Loading admin overview…" />;

  if (isError) {
    return (
      <EmptyState
        icon="error"
        title="Couldn't load admin overview"
        description="Something went wrong reaching the server. Try again in a moment."
      />
    );
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter mb-stack-lg">
        <StatCard icon="flag" label="Open Reports" value={openReportsCount ?? '—'} to="/admin/reports" />
        <StatCard icon="group" label="Total Users" value={totalUsersCount ?? '—'} to="/admin/users" />
      </div>

    </div>
  );
}