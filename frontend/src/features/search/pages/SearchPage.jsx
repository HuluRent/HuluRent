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

  const [pendingId, setPendingId] = useState(null);

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
      <section className="mb-8">
        <div className="bg-primary rounded-3xl p-8 md:p-12 mb-8 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Find what you need
            </h1>
            <SearchBar filters={filters} onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      {/* Two-Column Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-72 flex-shrink-0 lg:block hidden">
          <FilterPanel
            filters={filters}
            onUpdateFilter={updateFilter}
            onToggleCategory={toggleCategory}
            onClearAll={clearAll}
          />
        </aside>

        <div className="flex-1 w-full">
          {isMobileFilterOpen && (
            <div className="lg:hidden mb-6 relative z-20">
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

          {data && data.total > 0 && (
            <div className="mt-12 flex justify-center border-t border-surface-border pt-8">
              <Pagination
                page={data.page}
                limit={data.limit}
                total={data.total}
                onPageChange={(page) => updateFilter('page', page)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
