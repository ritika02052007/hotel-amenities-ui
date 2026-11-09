import { describe, it, expect } from 'vitest';
import { nextStatus, countActive } from '../js/requests.js';
import { AMENITIES, sortAmenities } from '../js/amenities.js';

describe('request workflow', () => {
  it('moves through the statuses and stops at Completed', () => {
    expect(nextStatus('Pending')).toBe('In progress');
    expect(nextStatus('In progress')).toBe('Completed');
    expect(nextStatus('Completed')).toBe('Completed');
  });
  it('counts active requests', () => {
    expect(countActive([{ status: 'Pending' }, { status: 'Completed' }, { status: 'In progress' }])).toBe(2);
  });
});

describe('sortAmenities', () => {
  it('sorts by name without changing the original list', () => {
    const names = sortAmenities(AMENITIES, 'name').map((a) => a.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(AMENITIES[0].name).toBe('Rooftop Spa');
  });
  it('puts open amenities first when sorting by status', () => {
    expect(sortAmenities(AMENITIES, 'status')[0].status).toBe('Open');
    expect(sortAmenities(AMENITIES, 'status').at(-1).status).toBe('Closed');
  });
});
