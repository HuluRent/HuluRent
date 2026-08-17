import { describe, expect, it } from 'vitest';
import {
  distanceKm,
  formatDistance,
  sortByDistance,
  withinRadius,
} from '../geo';

describe('geo utilities', () => {
  it('calculates distance between coordinates', () => {
    const distance = distanceKm(9.0192, 38.7525, 9.03, 38.76);

    expect(distance).toBeGreaterThan(1);
    expect(distance).toBeLessThan(2);
  });

  it('formats distances for display', () => {
    expect(formatDistance(0.85)).toBe('850 m away');
    expect(formatDistance(2.35)).toBe('2.4 km away');
  });

  it('sorts listings by distance', () => {
    const listings = [
      { id: 1, lat: 9.03, lng: 38.76 },
      { id: 2, lat: 9.02, lng: 38.755 },
    ];

    const result = sortByDistance(
      listings,
      { lat: 9.0192, lng: 38.7525 }
    );

    expect(result[0].id).toBe(2);
  });

  it('filters listings within a radius', () => {
    const listings = [
      { id: 1, lat: 9.02, lng: 38.755 },
      { id: 2, lat: 9.10, lng: 38.85 },
    ];

    const result = withinRadius(
      listings,
      { lat: 9.0192, lng: 38.7525 },
      2
    );

    expect(result.map((listing) => listing.id)).toEqual([1]);
  });
});