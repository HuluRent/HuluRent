import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useSearchListings } from '../useSearchListings';

// ─── Mock the API module ───────────────────────────────────────────────────
vi.mock('../../../../api/search.api');
import { searchListings } from '../../../../api/search.api';

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Build a fresh QueryClient with retries disabled so errors surface
 * immediately without retry delays in tests.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Disable the staleTime so tests always trigger a fetch
        staleTime: 0,
      },
    },
  });
}

/**
 * Create a wrapper component that provides a fresh QueryClient.
 * A new client per test ensures no cache leaks between tests.
 */
function makeWrapper() {
  const queryClient = makeQueryClient();
  return function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const SAMPLE_RESPONSE = {
  items: [
    { id: 'item-1', name: 'Bicycle', pricePerUnit: 50, pricingUnit: 'day' },
    { id: 'item-2', name: 'Tent', pricePerUnit: 30, pricingUnit: 'day' },
  ],
  total: 2,
  page: 1,
  limit: 20,
};

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

// ─── Tests ────────────────────────────────────────────────────────────────

describe('useSearchListings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ────────────────────────────────────────────────────────

  it('starts in a loading state before the query resolves', () => {
    searchListings.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  // ── Successful data fetch ────────────────────────────────────────────────

  it('returns data after a successful fetch', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(SAMPLE_RESPONSE);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('exposes the items array from the response', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.items).toHaveLength(2);
    expect(result.current.data.total).toBe(2);
  });

  // ── Error state ──────────────────────────────────────────────────────────

  it('enters an error state when the API call rejects', async () => {
    const apiError = new Error('Network error');
    searchListings.mockRejectedValue(apiError);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(apiError);
  });

  // ── API call parameters ──────────────────────────────────────────────────

  it('calls searchListings with the exact filters object', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const filters = { ...DEFAULT_FILTERS, query: 'camera', page: 2 };

    const { result } = renderHook(
      () => useSearchListings(filters),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchListings).toHaveBeenCalledWith(filters);
  });

  it('calls searchListings with default filters when no filters change', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchListings).toHaveBeenCalledWith(DEFAULT_FILTERS);
    expect(searchListings).toHaveBeenCalledTimes(1);
  });

  it('calls searchListings exactly once per render cycle for a stable filters reference', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchListings).toHaveBeenCalledTimes(1);
  });

  // ── Query key ────────────────────────────────────────────────────────────

  it('refetches when filters change (different query key)', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    let currentFilters = { ...DEFAULT_FILTERS };

    const { result, rerender } = renderHook(
      () => useSearchListings(currentFilters),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(searchListings).toHaveBeenCalledTimes(1);

    // Change filters — should trigger a second fetch
    currentFilters = { ...DEFAULT_FILTERS, query: 'drill' };
    rerender();

    await waitFor(() => expect(searchListings).toHaveBeenCalledTimes(2));
    expect(searchListings).toHaveBeenLastCalledWith(currentFilters);
  });

  // ── Empty result ─────────────────────────────────────────────────────────

  it('handles an empty items array without errors', async () => {
    const emptyResponse = { items: [], total: 0, page: 1, limit: 20 };
    searchListings.mockResolvedValue(emptyResponse);

    const { result } = renderHook(
      () => useSearchListings(DEFAULT_FILTERS),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.items).toHaveLength(0);
    expect(result.current.data.total).toBe(0);
  });

  // ── Pagination filters ───────────────────────────────────────────────────

  it('passes page and location filters through to the API', async () => {
    searchListings.mockResolvedValue(SAMPLE_RESPONSE);

    const filters = {
      ...DEFAULT_FILTERS,
      location: 'Addis Ababa',
      page: 3,
    };

    const { result } = renderHook(
      () => useSearchListings(filters),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchListings).toHaveBeenCalledWith(
      expect.objectContaining({ location: 'Addis Ababa', page: 3 }),
    );
  });
});
