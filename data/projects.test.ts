import { projects, publishedProjects, hasPublishedProjects } from './projects';

const MAX_DESCRIPTION_LENGTH = 300;

describe('projects', () => {
  it('exports a Project[] array (may be empty)', () => {
    expect(Array.isArray(projects)).toBe(true);
  });

  it('every entry should have required fields including published flag', () => {
    projects.forEach((entry) => {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('tagline');
      expect(entry).toHaveProperty('stack');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('links');
      expect(entry).toHaveProperty('published');
      expect(typeof entry.published).toBe('boolean');
    });
  });

  it('every entry should have non-empty string title, tagline, and description', () => {
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

  it('every present link should parse as a URL with https://', () => {
    projects.forEach((entry) => {
      const { live, repo, writeup } = entry.links;
      for (const [name, url] of [
        ['live', live],
        ['repo', repo],
        ['writeup', writeup],
      ] as const) {
        if (url === undefined) continue;
        expect(() => new URL(url), `${entry.id}.links.${name}`).not.toThrow();
        expect(new URL(url).protocol, `${entry.id}.links.${name} protocol`).toBe('https:');
      }
    });
  });
});

describe('publishedProjects + hasPublishedProjects', () => {
  it('publishedProjects contains only entries with published === true', () => {
    expect(publishedProjects.every((p) => p.published === true)).toBe(true);
  });

  it('publishedProjects is a subset of projects', () => {
    publishedProjects.forEach((p) => {
      expect(projects).toContain(p);
    });
  });

  it('hasPublishedProjects matches publishedProjects.length > 0', () => {
    expect(hasPublishedProjects).toBe(publishedProjects.length > 0);
  });
});
