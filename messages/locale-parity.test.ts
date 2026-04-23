import { describe, expect, it } from 'vitest';

import en from '@/messages/en.json';
import es from '@/messages/es.json';
import de from '@/messages/de.json';
import it_ from '@/messages/it.json';
import ja from '@/messages/ja.json';
import zh from '@/messages/zh.json';

type Dict = Record<string, unknown>;

/**
 * Walks a nested dictionary and returns every leaf's dotted path.
 * Leaves are anything that is not a plain object (strings, numbers, arrays, null).
 * The repo's message files are string-only, so this keeps the contract simple.
 */
function collectLeafPaths(obj: Dict, prefix = ''): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...collectLeafPaths(value as Dict, path));
    } else {
      out.push(path);
    }
  }
  return out;
}

function diff(a: string[], b: string[]): { missing: string[]; extra: string[] } {
  const aSet = new Set(a);
  const bSet = new Set(b);
  return {
    missing: a.filter((k) => !bSet.has(k)).sort(), // in a, not in b
    extra: b.filter((k) => !aSet.has(k)).sort(), // in b, not in a
  };
}

/** Collects (path, value) pairs for every leaf — used to assert non-empty strings. */
function collectLeafEntries(obj: Dict, prefix = ''): Array<[string, unknown]> {
  const out: Array<[string, unknown]> = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...collectLeafEntries(value as Dict, path));
    } else {
      out.push([path, value]);
    }
  }
  return out;
}

describe('locale parity', () => {
  it('en.json has a non-trivial number of leaf paths', () => {
    // Guards against an accidental regression in collectLeafPaths that would
    // make the parity check vacuously pass.
    const enPaths = collectLeafPaths(en as Dict);
    expect(enPaths.length).toBeGreaterThan(30);
  });

  it.each([
    ['es', es],
    ['de', de],
    ['it', it_],
    ['ja', ja],
    ['zh', zh],
  ] as const)('%s has the same key structure as en', (name, messages) => {
    const enPaths = collectLeafPaths(en as Dict);
    const localePaths = collectLeafPaths(messages as Dict);
    const { missing, extra } = diff(enPaths, localePaths);
    const issues: string[] = [];
    if (missing.length) issues.push(`missing in ${name}: ${missing.join(', ')}`);
    if (extra.length) issues.push(`extra in ${name}: ${extra.join(', ')}`);
    expect(issues, issues.join(' | ')).toEqual([]);
  });

  it.each([
    ['en', en],
    ['es', es],
    ['de', de],
    ['it', it_],
    ['ja', ja],
    ['zh', zh],
  ] as const)('%s has no empty string leaves', (name, messages) => {
    const entries = collectLeafEntries(messages as Dict);
    const bad = entries
      .filter(([, v]) => typeof v !== 'string' || v.length === 0)
      .map(([path, v]) => `${path}=${JSON.stringify(v)}`);
    expect(bad, `${name} has empty/non-string leaves: ${bad.join(', ')}`).toEqual([]);
  });
});
