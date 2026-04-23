import { projects } from './projects';

const MAX_DESCRIPTION_LENGTH = 300;

describe('projects', () => {
  it('should have at least one entry', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each entry should have required fields', () => {
    projects.forEach((entry) => {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('tagline');
      expect(entry).toHaveProperty('stack');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('links');
    });
  });

  it('each entry should have non-empty string title, tagline, and description', () => {
    projects.forEach((entry) => {
      expect(typeof entry.title).toBe('string');
      expect(entry.title.length).toBeGreaterThan(0);
      expect(typeof entry.tagline).toBe('string');
      expect(entry.tagline.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe('string');
      expect(entry.description.length).toBeGreaterThan(0);
    });
  });

  it('stack should be an array of strings', () => {
    projects.forEach((entry) => {
      expect(Array.isArray(entry.stack)).toBe(true);
      entry.stack.forEach((tech) => {
        expect(typeof tech).toBe('string');
        expect(tech.length).toBeGreaterThan(0);
      });
    });
  });

  it('all ids should be unique', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('description length should be <= 300 chars (layout guard)', () => {
    projects.forEach((entry) => {
      expect(
        entry.description.length,
        `${entry.id} description is ${entry.description.length} chars (max ${MAX_DESCRIPTION_LENGTH})`,
      ).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    });
  });

  it('every present link should parse as a URL', () => {
    projects.forEach((entry) => {
      const { live, repo, writeup } = entry.links;
      if (live !== undefined) {
        expect(() => new URL(live), `${entry.id}.links.live`).not.toThrow();
      }
      if (repo !== undefined) {
        expect(() => new URL(repo), `${entry.id}.links.repo`).not.toThrow();
      }
      if (writeup !== undefined) {
        expect(() => new URL(writeup), `${entry.id}.links.writeup`).not.toThrow();
      }
    });
  });
});
