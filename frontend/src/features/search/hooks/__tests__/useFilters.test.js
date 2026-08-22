import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useFilters } from '../useFilters';

const DEFAULT_FILTERS = {
  query: '',
  location: '',
  categoryIds: [],
  categorySlug: '',
  minPrice: '',
  maxPrice: '',
  verifiedOnly: false,
  sort: 'newest',
  page: 1,
};

import React from 'react';

const wrapper = ({ children }) => React.createElement(MemoryRouter, null, children);

describe('useFilters', () => {
  // ─── Initial state ────────────────────────────────────────────────────────

  it('returns the default filter values on mount', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    expect(result.current.filters).toEqual(DEFAULT_FILTERS);
  });

  it('exposes updateFilter, toggleCategory, and clearAll functions', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    expect(typeof result.current.updateFilter).toBe('function');
    expect(typeof result.current.toggleCategory).toBe('function');
    expect(typeof result.current.clearAll).toBe('function');
  });

  // ─── updateFilter ─────────────────────────────────────────────────────────

  it('updateFilter updates a single filter key', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('query', 'bicycle');
    });

    expect(result.current.filters.query).toBe('bicycle');
    // Other fields must remain at defaults
    expect(result.current.filters.location).toBe('');
    expect(result.current.filters.sort).toBe('newest');
  });

  it('updateFilter resets page to 1 when updating a non-page field', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    // First advance to page 3
    act(() => {
      result.current.updateFilter('page', 3);
    });
    expect(result.current.filters.page).toBe(3);

    // Changing any other filter must reset page
    act(() => {
      result.current.updateFilter('query', 'tent');
    });
    expect(result.current.filters.page).toBe(1);
  });

  it('updateFilter keeps the supplied page value when the key IS page', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('page', 5);
    });

    expect(result.current.filters.page).toBe(5);
  });

  it('updateFilter can set verifiedOnly to true', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('verifiedOnly', true);
    });

    expect(result.current.filters.verifiedOnly).toBe(true);
  });

  it('updateFilter works for minPrice and maxPrice', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('minPrice', '100');
      result.current.updateFilter('maxPrice', '500');
    });

    expect(result.current.filters.minPrice).toBe('100');
    expect(result.current.filters.maxPrice).toBe('500');
  });

  it('updateFilter updates sort without affecting other fields', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('query', 'camera');
      result.current.updateFilter('sort', 'price_asc');
    });

    expect(result.current.filters.sort).toBe('price_asc');
    expect(result.current.filters.query).toBe('camera');
  });

  // ─── toggleCategory ───────────────────────────────────────────────────────

  it('toggleCategory adds a category ID when it is not present', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.toggleCategory('cat-1');
    });

    expect(result.current.filters.categoryIds).toEqual(['cat-1']);
  });

  it('toggleCategory removes a category ID when it is already present', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.toggleCategory('cat-1');
    });
    act(() => {
      result.current.toggleCategory('cat-1');
    });

    expect(result.current.filters.categoryIds).toEqual([]);
  });

  it('toggleCategory can hold multiple category IDs', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.toggleCategory('cat-1');
      result.current.toggleCategory('cat-2');
      result.current.toggleCategory('cat-3');
    });

    expect(result.current.filters.categoryIds).toEqual([
      'cat-1',
      'cat-2',
      'cat-3',
    ]);
  });

  it('toggleCategory removes only the matching ID from a multi-category list', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.toggleCategory('cat-1');
      result.current.toggleCategory('cat-2');
      result.current.toggleCategory('cat-3');
    });
    act(() => {
      result.current.toggleCategory('cat-2');
    });

    expect(result.current.filters.categoryIds).toEqual(['cat-1', 'cat-3']);
  });

  it('toggleCategory resets page to 1', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('page', 4);
    });
    act(() => {
      result.current.toggleCategory('cat-1');
    });

    expect(result.current.filters.page).toBe(1);
  });

  // ─── clearAll ─────────────────────────────────────────────────────────────

  it('clearAll resets all filters to their defaults', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.updateFilter('query', 'drill');
      result.current.updateFilter('minPrice', '50');
      result.current.updateFilter('page', 7);
      result.current.toggleCategory('cat-5');
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.filters).toEqual(DEFAULT_FILTERS);
  });
});
