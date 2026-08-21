import { useState, useEffect } from 'react';
import { useCategories } from '../../../hooks/useCategories';

const QUICK_AREAS = ['Bole', 'Kazanchis', 'Piassa', 'CMC', 'Lideta'];

export function FilterPanel({ filters, onUpdateFilter, onToggleCategory, onClearAll }) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  function handleApply() {
    onUpdateFilter('minPrice', minPrice);
    onUpdateFilter('maxPrice', maxPrice);
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-surface-border sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-text">Filters</h2>
        <button onClick={onClearAll} className="text-sm font-medium text-primary hover:text-primary-hover hover:underline transition-colors">
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text mb-4 tracking-wide">Categories</h3>
        <div className="space-y-2">
          {categoriesLoading && <div className="animate-pulse flex flex-col gap-3">{[1,2,3,4].map(i => <div key={i} className="h-5 bg-surface-muted rounded w-3/4"></div>)}</div>}

          {categories?.items?.filter(c => !c.parentId).map((parent) => (
            <div key={parent.id} className="mb-2">
              <label className="flex items-center gap-3 cursor-pointer group py-1">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={filters.categoryIds.includes(parent.id)}
                    onChange={() => onToggleCategory(parent.id)}
                    className="peer w-5 h-5 border-2 border-slate-300 rounded text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  />
                </div>
                <span className="text-text font-medium group-hover:text-primary transition-colors">{parent.name}</span>
              </label>

              {/* Children */}
              {categories.items.filter(c => c.parentId === parent.id).length > 0 && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-surface-border pl-3">
                  {categories.items.filter(c => c.parentId === parent.id).map(child => (
                    <label key={child.id} className="flex items-center gap-3 cursor-pointer group py-1">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={filters.categoryIds.includes(child.id)}
                          onChange={() => onToggleCategory(child.id)}
                          className="peer w-4 h-4 border-2 border-slate-300 rounded text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        />
                      </div>
                      <span className="text-sm text-text-muted group-hover:text-primary transition-colors">{child.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text mb-4 tracking-wide">Popular Areas</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => onUpdateFilter('location', filters.location === area ? '' : area)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.location === area
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-muted text-text-muted hover:bg-slate-200 hover:text-text'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text mb-4 tracking-wide">Price (ETB/day)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 bg-surface-muted border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm text-text outline-none transition-all"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 bg-surface-muted border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm text-text outline-none transition-all"
          />
        </div>
        {(minPrice !== filters.minPrice || maxPrice !== filters.maxPrice) && (
          <button
            onClick={handleApply}
            className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-text font-medium py-2 rounded-lg transition-colors text-sm"
          >
            Apply Price Filter
          </button>
        )}
      </div>

      {/* Verification */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-4 tracking-wide">Trust</h3>
        <label className="flex items-center gap-3 cursor-pointer group p-3 bg-surface-muted rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-surface-border">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onUpdateFilter('verifiedOnly', e.target.checked)}
            className="w-5 h-5 border-2 border-slate-300 rounded text-primary focus:ring-primary/20 transition-all cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="text-text font-medium flex items-center gap-1.5">
              Verified Owners
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </span>
            <span className="text-xs text-text-muted">ID checked by HuluRent</span>
          </div>
        </label>
      </div>
    </div>
  );
}