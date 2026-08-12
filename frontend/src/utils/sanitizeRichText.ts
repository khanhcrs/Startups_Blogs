import DOMPurify from 'dompurify';

const RICH_TEXT_TAGS = [
  'p',
  'br',
  'h1',
  'h2',
  'h3',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'blockquote',
  'ol',
  'ul',
  'li',
  'a',
  'img',
  'pre',
  'code',
  'span',
] as const;

const RICH_TEXT_ATTRIBUTES = [
  'href',
  'src',
  'alt',
  'title',
  'data-list',
] as const;

/**
 * Sanitize persisted rich text before inserting it into the DOM.
 *
 * The allowlist intentionally covers the formats emitted by the Quill editor
 * while excluding active content, inline styles, forms, embeds, SVG and MathML.
 * DOMPurify additionally rejects unsafe URL protocols such as `javascript:`.
 */
export function sanitizeRichText(html: unknown): string {
  if (typeof html !== 'string' || html.length === 0) {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...RICH_TEXT_TAGS],
    ALLOWED_ATTR: [...RICH_TEXT_ATTRIBUTES],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'svg', 'math'],
    FORBID_ATTR: ['style', 'id', 'srcset', 'formaction', 'xlink:href'],
  });
}
