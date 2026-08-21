// Browse/search page — converted from the Stitch AI design. This is the
// app's homepage ("/search" in router.jsx).
//
// Two things worth knowing if you're picking this up:
//  1. The Saved List (bookmark icon on each card) is a real persisted feature
//     backed by /saved-list API endpoints. The saved list is fetched once here
//     and threaded down to cards — no per-card fetches.
//  2. Search filter contracts (location, verifiedOnly, sort, multi-category)
//     were added to api-reference.md's Search section specifically to
//     support this page — read that note if backend search.service.js
//     doesn't match what this page sends.

import { useState, useMemo } from 'react';
import { useSearchListings } from '../hooks/useSearchListings';
import { useFilters } from '../hooks/useFilters';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { Pagination } from '../../../components/Pagination';
import { useAuth } from '../../../hooks/useAuth';
import {
  useSavedList,
  useAddToSavedList,
  useRemoveFromSavedList,
} from '../../savedList/hooks/useSavedList';

export function SearchPage() {
  const { filters, updateFilter, toggleCategory, clearAll } = useFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data, isLoading, isError } = useSearchListings(filters);

  // Saved list — only fetch when authenticated
  const { isAuthenticated } = useAuth();
  const { data: savedListData } = useSavedList({ enabled: isAuthenticated });
  const addMutation = useAddToSavedList();
  const removeMutation = useRemoveFromSavedList();

  // Track which listing is currently being toggled (for spinner feedback)
  const [pendingId, setPendingId] = useState(null);

  // Build a Set of saved listing IDs for O(1) lookup
  const savedIds = useMemo(() => {
    if (!savedListData) return null;
    return new Set(savedListData.map((entry) => entry.listingId));
  }, [savedListData]);

  function handleSave(listingId) {
    setPendingId(listingId);
    addMutation.mutate(listingId, { onSettled: () => setPendingId(null) });
  }

  function handleUnsave(listingId) {
    setPendingId(listingId);
    removeMutation.mutate(listingId, { onSettled: () => setPendingId(null) });
  }

  function handleHeroSearch({ query, location }) {
    updateFilter('query', query);
    updateFilter('location', location);
  }

  return (
    <>
      {/* Hero / Search Section */}
      <section className="mb-stack-lg">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-stack-md">
          Find what you need
        </h1>
        <SearchBar filters={filters} onSearch={handleHeroSearch} />
      </section>

      {/* Two-Column Grid */}
      <div className="flex flex-col lg:flex-row gap-gutter">
        <aside className="w-full lg:w-64 flex-shrink-0 lg:block hidden">
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            onToggleCategory={toggleCategory}
            onClearAll={clearAll}
          />
        </aside>

        <div className="flex-1">
          {isMobileFilterOpen && (
            <div className="lg:hidden mb-stack-lg p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
              <FilterPanel
                filters={filters}
                onUpdateFilter={updateFilter}
                onToggleCategory={toggleCategory}
                onClearAll={clearAll}
              />
            </div>
          )}

          <ResultsGrid
            data={data}
            isLoading={isLoading}
            isError={isError}
            sort={filters.sort}
            onSortChange={(value) => updateFilter('sort', value)}
            onMobileFilterToggle={() => setIsMobileFilterOpen((v) => !v)}
            savedIds={isAuthenticated ? savedIds : null}
            onSave={isAuthenticated ? handleSave : undefined}
            onUnsave={isAuthenticated ? handleUnsave : undefined}
            savePendingId={pendingId}
          />

          {data && (
            <Pagination
              page={data.page}
              limit={data.limit}
              total={data.total}
              onPageChange={(page) => updateFilter('page', page)}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default SearchPage;
