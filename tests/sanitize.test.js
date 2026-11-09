import { describe, it, expect } from 'vitest';
import { sanitize } from '../js/sanitize.js';

const payloads = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  'javascript:alert(1)',
  '"><svg onload=alert(1)>',
  "'; DROP TABLE users; --<b onmouseover=x>"
];

describe('sanitize', () => {
  it.each(payloads)('neutralizes %s', (p) => {
    const out = sanitize(p);
    expect(out).not.toMatch(/[<>"'`]/);
    expect(out.toLowerCase()).not.toContain('javascript:');
    expect(out).not.toMatch(/on\w+\s*=/i);
  });
  it('keeps normal text and handles null', () => {
    expect(sanitize('  Anna Smith ')).toBe('Anna Smith');
    expect(sanitize(null)).toBe('');
  });
});
