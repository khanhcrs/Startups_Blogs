// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { sanitizeRichText } from './sanitizeRichText';

describe('sanitizeRichText', () => {
  it('keeps the safe rich-text subset emitted by the editor', () => {
    const html = '<h2>Heading</h2><p><strong>Safe</strong> <a href="https://example.com">link</a></p><ol><li data-list="bullet">Item</li></ol>';

    expect(sanitizeRichText(html)).toBe(html);
  });

  it('removes scripts, event handlers, inline styles and unsafe URLs', () => {
    const dirty = [
      '<script>alert(1)</script>',
      '<img src="x" onerror="alert(2)">',
      '<a class="modal-overlay" href="javascript:alert(3)" style="color:red">click</a>',
      '<svg><a xlink:href="javascript:alert(4)">bad</a></svg>',
    ].join('');

    const clean = sanitizeRichText(dirty);

    expect(clean).not.toMatch(/script|onerror|javascript:|style=|class=|svg|xlink/i);
    expect(clean).toContain('<img src="x">');
    expect(clean).toContain('<a>click</a>');
  });

  it('returns an empty string for non-string API values', () => {
    expect(sanitizeRichText(undefined)).toBe('');
    expect(sanitizeRichText({ html: '<p>unexpected</p>' })).toBe('');
  });
});
