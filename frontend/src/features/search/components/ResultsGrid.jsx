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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-text">
          {isLoading ? 'Searching...' : (
            <>{data?.total || 0} <span className="font-normal text-text-muted">rentals found</span></>
          )}
        </h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <span className="text-sm font-medium text-text-muted hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white border border-surface-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm flex-1 sm:flex-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onMobileFilterToggle}
            className="lg:hidden p-2 border border-surface-border rounded-lg flex items-center justify-center bg-white shadow-sm hover:bg-surface-muted transition-colors text-text"
            aria-label="Toggle filters"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-surface-muted rounded-xl h-[340px] border border-surface-border"></div>
          ))}
        </div>
      )}

      {isError && (
        <div className="py-12">
          <EmptyState
            icon="error"
            title="Couldn't load listings"
            description="Something went wrong reaching the server. Try again in a moment."
          />
        </div>
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <div className="py-12 border border-dashed border-slate-300 rounded-2xl bg-surface-muted">
          <EmptyState
            title="No rentals match your search"
            description="Try widening your price range, clearing filters, or searching a different area."
          />
        </div>
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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