import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useGeolocation } from '../useGeolocation';

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles denied location permission without crashing', () => {
    const getCurrentPosition = vi.fn((success, error) => {
      error({
        code: 1,
        message: 'User denied Geolocation',
      });
    });

    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition },
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.status).toBe('denied');
    expect(result.current.position).toBeNull();
    expect(result.current.error).toBe('User denied Geolocation');
  });

  it('returns the user position when permission is granted', () => {
    const getCurrentPosition = vi.fn((success) => {
      success({
        coords: {
          latitude: 9.0192,
          longitude: 38.7525,
        },
      });
    });

    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition },
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.status).toBe('success');
    expect(result.current.position).toEqual({
      lat: 9.0192,
      lng: 38.7525,
    });
  });
});