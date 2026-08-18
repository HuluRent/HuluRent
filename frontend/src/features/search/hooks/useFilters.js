// Local filter state for the browse/search page. Deliberately not in
// AppShell-level context — filters are specific to this page's session,
// not global app state (see ARCHITECTURE.md §4.1 on what belongs in Context
// vs. component state).

import { useState, useCallback } from 'react';

const DEFAULT_FILTERS = {
  query: '',
  location: '',
  categoryIds: [],
  minPrice: '',
  maxPrice: '',
  verifiedOnly: false,
  sort: 'recommended',
  page: 1,
};

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  }, []);

  const toggleCategory = useCallback((categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
      page: 1,
    }));
  }, []);

  const clearAll = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, updateFilter, toggleCategory, clearAll };
}