import { skillCategories } from './skills';

describe('skillCategories', () => {
  it('should have 4 categories', () => {
    expect(skillCategories).toHaveLength(4);
  });

  it('each category should have id, name, and non-empty skills array', () => {
    skillCategories.forEach((category) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(Array.isArray(category.skills)).toBe(true);
      expect(category.skills.length).toBeGreaterThan(0);
      category.skills.forEach((skill) => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('years');
        expect(typeof skill.years).toBe('number');
        expect(skill.years).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('should include Frontend, Backend, Tools & Infrastructure, and Practices', () => {
    const names = skillCategories.map((c) => c.name);
    expect(names).toContain('Frontend');
    expect(names).toContain('Backend');
    expect(names).toContain('Tools & Infrastructure');
    expect(names).toContain('Practices');
  });

  it('Frontend should include React and TypeScript', () => {
    const frontend = skillCategories.find((c) => c.id === 'frontend');
    const names = frontend?.skills.map((s) => s.name) ?? [];
    expect(names).toContain('React');
    expect(names).toContain('TypeScript');
  });
});
