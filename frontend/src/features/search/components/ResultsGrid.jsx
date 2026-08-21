// Toolbar (result count + sort + mobile filter toggle) + the card grid.
// Loading/error/empty states live here rather than in SearchPage, since
// they're specific to "did the search return results," not the page shell.

import { ListingCard } from '../../listings/components/ListingCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export function ResultsGrid({
  data,
  isLoading,
  isError,
  sort,
  onSortChange,
  onMobileFilterToggle,
  savedIds,
  onSave,
  onUnsave,
  savePendingId,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-stack-md">
        <span className="font-body-md text-on-surface-variant">
          {isLoading ? 'Searching…' : `${data?.total ?? 0} items found`}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={onMobileFilterToggle}
            className="lg:hidden ml-2 p-2 border border-outline-variant rounded-lg flex items-center justify-center bg-surface-container-lowest"
            aria-label="Toggle filters"
          >
            <span className="material-symbols-outlined text-on-surface">filter_list</span>
          </button>
        </div>
      </div>

      {isLoading && <LoadingSpinner label="Searching listings…" />}

      {isError && (
        <EmptyState
          icon="error"
          title="Couldn't load listings"
          description="Something went wrong reaching the server. Try again in a moment."
        />
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <EmptyState
          title="No listings match your search"
          description="Try widening your price range or clearing a filter."
        />
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {data.items.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              isSaved={savedIds ? savedIds.has(item.id) : false}
              onSave={onSave}
              onUnsave={onUnsave}
              isSavePending={savePendingId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}