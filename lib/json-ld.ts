/**
 * Serialize a value for embedding inside a `<script type="application/ld+json">`
 * block via dangerouslySetInnerHTML.
 *
 * JSON.stringify alone is not sufficient. The HTML parser ends a script element
 * at the literal character sequence for a closing script tag, even when it
 * appears inside a JSON string literal. A value containing that sequence would
 * therefore break out of the script element and let everything after it be
 * parsed as markup — the classic JSON-in-script XSS sink.
 *
 * Rewriting every `<` to its JSON unicode escape keeps the payload semantically
 * identical (JSON.parse maps the escape straight back to `<`, so consumers like
 * Google's structured-data parser see the same object) while making a closing
 * tag unrepresentable in the emitted HTML.
 *
 * The inputs used today are static site config, but encoding at the sink means
 * the safety does not depend on that staying true.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
