// Structural invariants connecting the three hand-sync lists that together
// define the single-page navigation contract:
//   1. SECTION_IDS    (hooks/useActiveSection) — all sections on the page
//   2. navLinkIds     (components/layout/Navbar) — sections linked in the nav
//   3. messages.en.nav (messages/en.json)       — i18n labels for nav keys
//
// A mismatch here = active-nav silently points to the wrong section, or a
// nav link renders "undefined". These used to drift silently; now they can't.
import { SECTION_IDS } from '@/hooks/useActiveSection';
import { navLinkIds } from '@/components/layout/Navbar';
import en from '@/messages/en.json';

describe('nav/section contract', () => {
  it("SECTION_IDS starts with 'hero'", () => {
    expect(SECTION_IDS[0]).toBe('hero');
  });

  it('every nav link points to a section id that exists in SECTION_IDS', () => {
    for (const link of navLinkIds) {
      expect(SECTION_IDS).toContain(link.id);
    }
  });

  it('every nav link key resolves to a non-empty label in en.nav', () => {
    const navMessages = en.nav as Record<string, string>;
    for (const link of navLinkIds) {
      expect(navMessages).toHaveProperty(link.key);
      expect(navMessages[link.key]).toBeTruthy();
    }
  });

  it("navLinkIds excludes 'hero' (hero is a scroll target, not a nav link)", () => {
    const navIds = navLinkIds.map((l) => l.id);
    expect(navIds).not.toContain('hero');
  });

  it('SECTION_IDS has no duplicates', () => {
    expect(new Set(SECTION_IDS).size).toBe(SECTION_IDS.length);
  });

  it('navLinkIds has no duplicate ids or keys', () => {
    const ids = navLinkIds.map((l) => l.id);
    const keys = navLinkIds.map((l) => l.key);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
