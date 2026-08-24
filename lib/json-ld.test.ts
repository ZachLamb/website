import { describe, it, expect } from 'vitest';
import { toJsonLd } from './json-ld';

describe('toJsonLd', () => {
  it('round-trips to the original object', () => {
    const data = { '@type': 'Person', name: 'Zach Lamb', sameAs: ['https://example.com'] };
    expect(JSON.parse(toJsonLd(data))).toEqual(data);
  });

  it('escapes a closing script tag so it cannot terminate the script element', () => {
    const out = toJsonLd({ name: '</script><img src=x onerror=alert(1)>' });
    expect(out).not.toContain('</script>');
    expect(out).not.toContain('<');
  });

  it('preserves the escaped value semantically', () => {
    const payload = { name: '</script>' };
    expect(JSON.parse(toJsonLd(payload))).toEqual(payload);
  });

  it('escapes every angle bracket occurrence, not just the first', () => {
    const out = toJsonLd({ a: '<<<', b: '<' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual({ a: '<<<', b: '<' });
  });
});
