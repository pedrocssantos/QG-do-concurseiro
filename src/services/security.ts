// ==========================================================================
// QG DO CONCURSEIRO - SECURITY SERVICE & DATA SANITIZATION (DOMPurify)
// ==========================================================================
import DOMPurify from "dompurify";

/**
 * Sanitizes an HTML string using DOMPurify to prevent XSS attacks.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      "strong", "em", "b", "i", "br", "p", "code", "pre",
      "ul", "ol", "li", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"
    ],
    ALLOWED_ATTR: ["class", "style", "title", "data-opt-id", "data-concurso-id"]
  });
}

/**
 * Sanitizes a plain text string by stripping all HTML tags.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return DOMPurify.sanitize(String(text), { ALLOWED_TAGS: [] });
}

/**
 * Validates whether an imported state object is safe from Prototype Pollution.
 */
export function isSafeObject(obj: any): boolean {
  if (!obj || typeof obj !== "object") return true;
  if (Object.prototype.hasOwnProperty.call(obj, "__proto__") ||
      Object.prototype.hasOwnProperty.call(obj, "constructor") ||
      Object.prototype.hasOwnProperty.call(obj, "prototype")) {
    return false;
  }
  return true;
}
