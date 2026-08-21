// Browse/search page — converted from the Stitch AI design. This is the
// app's homepage ("/" in router.jsx).
//
// Two things worth knowing if you're picking this up:
//  1. "Favorites" (the heart icon on each card) is NOT in the documented
//     product scope (spec.md) or API contract (api-reference.md) — it's
//     implemented as local component state only in ListingCard.jsx, not
//     persisted. If the team wants real favorites, that needs a schema
//     addition and an endpoint spec'd first, not silent scope creep here.
//  2. Search filter contracts (location, verifiedOnly, sort, multi-category)
//     were added to api-reference.md's Search section specifically to
//     support this page — read that note if backend search.service.js
//     doesn't match what this page sends.

import { useState } from 'react';
import { useSearchListings } from '../hooks/useSearchListings';
import { useFilters } from '../hooks/useFilters';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { Pagination } from '../../../components/Pagination';

export function SearchPage() {
  const { filters, updateFilter, toggleCategory, clearAll } = useFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data, isLoading, isError } = useSearchListings(filters);

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
