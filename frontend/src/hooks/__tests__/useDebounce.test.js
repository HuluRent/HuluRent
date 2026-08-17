import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('updates the value after the delay', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second' });

    expect(result.current).toBe('first');

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('second');

    vi.useRealTimers();
  });
});