import { describe, it, expect } from 'vitest';
import { validateRequest } from '../js/validate.js';

const valid = { name: 'Anna', room: '204', amenity: 'Rooftop Spa', time: '10:30', notes: '' };

describe('validateRequest', () => {
  it('accepts a valid request', () => expect(validateRequest(valid)).toEqual({}));
  it('flags every bad field', () => {
    const errors = validateRequest({ name: ' ', room: '12', amenity: '', time: '', notes: 'x'.repeat(301) });
    expect(Object.keys(errors).sort()).toEqual(['amenity', 'name', 'notes', 'room', 'time']);
  });
  it('rejects malformed room numbers', () => {
    expect(validateRequest({ ...valid, room: 'A12' }).room).toBeTruthy();
    expect(validateRequest({ ...valid, room: '12345' }).room).toBeTruthy();
  });
});
