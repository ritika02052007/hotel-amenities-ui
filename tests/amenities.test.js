import { describe, it, expect, vi, afterEach } from 'vitest';
import { AMENITIES, fetchAmenities, filterAmenities } from '../js/amenities.js';

afterEach(() => vi.useRealTimers());

describe('amenities data', () => {
  it('has a consistent shape', () => {
    AMENITIES.forEach((a) => {
      expect(Object.keys(a).sort()).toEqual(['category', 'description', 'hours', 'id', 'name', 'status']);
      expect(typeof a.id).toBe('number');
    });
  });
  it('filters by text and category', () => {
    expect(filterAmenities(AMENITIES, { query: 'spa' }).map((a) => a.name)).toContain('Rooftop Spa');
    expect(filterAmenities(AMENITIES, { category: 'Dining' }).every((a) => a.category === 'Dining')).toBe(true);
  });
  it('returns an empty list when nothing matches', () => {
    expect(filterAmenities(AMENITIES, { query: 'zzzz' })).toEqual([]);
  });
  it('resolves after a delay and rejects on failure', async () => {
    vi.useFakeTimers();
    const ok = fetchAmenities({ delay: 500 });
    vi.advanceTimersByTime(500);
    await expect(ok).resolves.toHaveLength(AMENITIES.length);
    const bad = fetchAmenities({ fail: true, delay: 100 });
    const assertion = expect(bad).rejects.toThrow('Network error');
    vi.advanceTimersByTime(100);
    await assertion;
  });
});
