import { TRAIL_GUTTER_CLASS, SECTION_NUMERALS } from './trail-position';
import { SECTION_IDS } from '@/hooks/useActiveSection';

describe('trail-position', () => {
  it('positions the trail against the content column, not the viewport edge', () => {
    expect(TRAIL_GUTTER_CLASS).toContain('1024px'); // max-w-5xl
  });

  it('has a numeral for every non-hero section', () => {
    for (const id of SECTION_IDS.filter((s) => s !== 'hero')) {
      expect(SECTION_NUMERALS[id]).toBeTruthy();
    }
  });
});
