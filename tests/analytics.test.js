import { it, expect, vi } from 'vitest';
import { track } from '../js/analytics.js';

it('logs the analytics ping', () => {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  track('request-submitted');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Analytics] User interacted with Boutique Hotel Amenities UI'));
  spy.mockRestore();
});
