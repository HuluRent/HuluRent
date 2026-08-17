// Converted from the Stitch AI design's sidebar. Two deliberate deviations
// from the original static markup, both noted inline below:
//   1. Categories are fetched live (useCategories), not hardcoded.
//   2. Location changed from independent checkboxes to single-select quick
//      chips, since the backend's `location` param (api-reference.md) is a
//      single free-text match, not a multi-value filter.

import { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';

// Frontend-only convenience list for the quick-select chips — not fetched
// from the backend, since approxLocation is free text per listing with no
// canonical neighborhood list in the schema. Fine for an Addis-only MVP;
// revisit if this needs to be data-driven later.
const QUICK_AREAS = ['Bole', 'Kazanchis', 'Piassa', 'CMC'];

export function FilterPanel({ filters, onUpdateFilter, onToggleCategory, onClearAll }) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Price inputs are local until blur/Apply — typing a digit shouldn't
  // trigger a refetch on every keystroke.
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  function handleApply() {
    onUpdateFilter('minPrice', minPrice);
    onUpdateFilter('maxPrice', maxPrice);
  }

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant sticky top-[96px] max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-stack-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
        <button onClick={onClearAll} className="font-label-sm text-label-sm text-primary hover:underline">
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="mb-stack-lg border-b border-outline-variant pb-stack-lg">
        <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-2">
          {categoriesLoading && <p className="font-body-sm text-on-surface-variant">Loading…</p>}
          {categories?.items?.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categoryIds.includes(category.id)}
                onChange={() => onToggleCategory(category.id)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="font-body-md text-on-surface">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location — quick-select chips, single value, see file header note */}
      <div className="mb-stack-lg border-b border-outline-variant pb-stack-lg">
        <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm uppercase tracking-wider">
          Location
        </h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => onUpdateFilter('location', filters.location === area ? '' : area)}
              className={`px-3 py-1.5 rounded-full border font-label-sm text-label-sm transition-colors ${
                filters.location === area
                  ? 'bg-primary-container text-on-primary border-primary-container'
                  : 'border-outline-variant text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-stack-lg border-b border-outline-variant pb-stack-lg">
        <h3 className="font-label-sm text-label-sm text-on-surface-variant mb-stack-sm uppercase tracking-wider">
          Price (ETB/day)
        </h3>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-2 py-1 border border-outline-variant rounded text-sm text-center"
          />
          <span className="text-on-surface-variant">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-2 py-1 border border-outline-variant rounded text-sm text-center"
          />
        </div>
      </div>

      {/* Verification */}
      <div className="mb-stack-lg border-b border-outline-variant pb-stack-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onUpdateFilter('verifiedOnly', e.target.checked)}
            className="rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="font-body-md text-on-surface flex items-center gap-1">
            Verified Owners Only{' '}
            <span
              className="material-symbols-outlined text-primary text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </span>
        </label>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-primary-container text-on-primary font-headline-md text-headline-md px-4 py-2 rounded-lg shadow-subtle hover:shadow-hover transition-all"
      >
        Apply Filters
      </button>
    </div>
  );
}