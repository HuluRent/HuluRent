// Generic pagination controls — shared across any list endpoint using the
// { items, page, limit, total } envelope (api-reference.md "Conventions").

export function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  // Simple windowed page list: current page +/- 1, always show first/last.
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sortedPages = [...pages].sort((a, b) => a - b);

  return (
    <div className="mt-stack-lg flex justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {sortedPages.map((p, i) => {
        const prev = sortedPages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-on-surface-variant">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-body-md ${
                p === page
                  ? 'bg-primary-container text-on-primary'
                  : 'border border-outline-variant hover:bg-surface-container-low text-on-surface'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}