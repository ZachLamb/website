import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TRAIL_GUTTER_CLASS, TRAIL_OFFSET_LEFT } from './trail-position';

describe('trail-position', () => {
  it('positions the trail against the content column, not the viewport edge', () => {
    expect(TRAIL_GUTTER_CLASS).toContain('1024px'); // max-w-5xl
  });

  it('embeds TRAIL_GUTTER_CLASS as a literal string, not an interpolation of TRAIL_OFFSET_LEFT', () => {
    // Tailwind's static scanner extracts class candidates as literal
    // substrings of source files — it never evaluates JS template literals.
    // If TRAIL_GUTTER_CLASS is ever refactored back to interpolate
    // TRAIL_OFFSET_LEFT (e.g. `` `...md:left-[${TRAIL_OFFSET_LEFT}]...` ``),
    // Tailwind stops generating the rule and the trail silently collapses to
    // the viewport edge with zero test failures elsewhere. Reading this
    // file's own source text is the only way to catch that regression.
    const source = readFileSync(join(__dirname, 'trail-position.ts'), 'utf-8');
    const gutterClassLine = source
      .split('\n')
      .find((line) => line.includes("'pointer-events-none fixed"));
    expect(gutterClassLine).toBeDefined();
    expect(gutterClassLine).not.toContain('${');
    expect(TRAIL_GUTTER_CLASS).toContain(TRAIL_OFFSET_LEFT);
  });
});
