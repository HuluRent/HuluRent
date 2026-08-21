// Local filter state for the browse/search page. Deliberately not in
// AppShell-level context — filters are specific to this page's session,
// not global app state.
//
// On first mount, reads ?query=, ?location=, and ?category= from the URL
// so that home-page category cards and the hero search bar can deep-link
// directly into a pre-filtered browse page.

import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_FILTERS = {
  query: '',
  location: '',
  categorySlug: '',   // used for URL-based category pre-selection
  categoryIds: [],
  minPrice: '',
  maxPrice: '',
  verifiedOnly: false,
  sort: 'newest',
  page: 1,
};

export function useFilters() {
  const [searchParams] = useSearchParams();

  // Seed initial state from URL query params (set by category cards / hero search)
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    categorySlug: searchParams.get('category') || '',
  }));

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