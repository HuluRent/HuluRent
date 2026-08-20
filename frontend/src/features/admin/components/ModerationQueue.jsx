import { useUpdateReportStatus } from '../hooks/useAdminReports';

const statusColors = {
  OPEN: 'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-600',
};

export function ModerationQueue({ reports = [], statusFilter, onFilterChange }) {
  const updateMut = useUpdateReportStatus();

  const handleStatusChange = (id, status) => {
    if (window.confirm(`Mark this report as ${status}?`)) {
      updateMut.mutate({ id, status });
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].map((s) => (
          <button
            key={s}
            onClick={() => onFilterChange(s === 'ALL' ? undefined : s)}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors ${
              (statusFilter || 'ALL') === (s === 'ALL' ? undefined : s) || (!statusFilter && s === 'ALL')
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {reports.length === 0 ? (
        <p className="font-body-md text-on-surface-variant py-8 text-center">No reports found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="font-label-md text-on-surface">{report.reason}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${statusColors[report.status] || ''}`}>
                    {report.status}
                  </span>
                </div>
                <span className="font-label-sm text-on-surface-variant whitespace-nowrap">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              {report.details && (
                <p className="font-body-sm text-on-surface-variant mb-2 line-clamp-2">{report.details}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-3">
                <span>By: {report.author?.displayName || report.authorId}</span>
                {report.subject && <span>Against: {report.subject?.displayName || report.subjectId}</span>}
              </div>

              <div className="flex gap-2 flex-wrap">
                {report.status === 'OPEN' && (
                  <button onClick={() => handleStatusChange(report.id, 'UNDER_REVIEW')} disabled={updateMut.isPending}
                    className="px-3 py-1.5 bg-amber-500 text-white font-label-sm rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60">
                    Review
                  </button>
                )}
                {['OPEN', 'UNDER_REVIEW'].includes(report.status) && (
                  <>
                    <button onClick={() => handleStatusChange(report.id, 'RESOLVED')} disabled={updateMut.isPending}
                      className="px-3 py-1.5 bg-green-600 text-white font-label-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                      Resolve
                    </button>
                    <button onClick={() => handleStatusChange(report.id, 'DISMISSED')} disabled={updateMut.isPending}
                      className="px-3 py-1.5 bg-gray-500 text-white font-label-sm rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-60">
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModerationQueue;
