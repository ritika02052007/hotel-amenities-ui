/** Strips tags, event handlers, javascript: URLs and quote/angle characters. */
export function sanitize(value) {
  return String(value ?? '')
    .replace(/<[^>]*>?/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>"'`]/g, '')
    .trim();
}
