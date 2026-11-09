import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('css/styles.css', 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');

describe('accessibility structure', () => {
  it('has one h1, landmarks and a skip link', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    ['header', 'nav', 'main', 'footer'].forEach((t) => expect(doc.querySelector(t)).not.toBeNull());
    expect(doc.querySelector('a.skip[href="#main"]')).not.toBeNull();
    expect(doc.documentElement.lang).toBe('en');
  });
  it('labels every form control', () => {
    doc.querySelectorAll('input, select, textarea').forEach((c) => {
      expect(doc.querySelector(`label[for="${c.id}"]`) || c.getAttribute('aria-label')).toBeTruthy();
    });
  });
  it('links each field to an error message', () => {
    doc.querySelectorAll('#request-form [aria-describedby]').forEach((c) => {
      expect(doc.getElementById(c.getAttribute('aria-describedby'))).not.toBeNull();
    });
  });
});

describe('design tokens', () => {
  it('keeps hex colors inside :root only', () => {
    const outside = css.replace(/:root[^{]*\{[^}]*\}/g, '');
    expect(outside).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
  it('uses no external libraries', () => {
    expect(html).not.toMatch(/react|tailwind|bootstrap/i);
  });
});
