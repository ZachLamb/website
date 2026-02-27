import { experiences } from './experience';

describe('experiences', () => {
  it('should have exactly 10 entries', () => {
    expect(experiences).toHaveLength(10);
  });

  it('each entry should have all required fields', () => {
    experiences.forEach((entry) => {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('company');
      expect(entry).toHaveProperty('position');
      expect(entry).toHaveProperty('startDate');
      expect(entry).toHaveProperty('endDate');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('techStack');
    });
  });

  it('first entry should be Circadence', () => {
    expect(experiences[0].company).toBe('Circadence');
  });

  it('last entry should be CU Boulder IT', () => {
    expect(experiences[experiences.length - 1].id).toBe('cu-boulder-it');
  });

  it('each description should be a non-empty array', () => {
    experiences.forEach((entry) => {
      expect(Array.isArray(entry.description)).toBe(true);
      expect(entry.description.length).toBeGreaterThan(0);
    });
  });

  it('techStack should be an array (can be empty for freelance)', () => {
    experiences.forEach((entry) => {
      expect(Array.isArray(entry.techStack)).toBe(true);
    });

    const freelance = experiences.find((e) => e.id === 'freelance');
    expect(freelance?.techStack).toHaveLength(0);
  });

  it('all ids should be unique', () => {
    const ids = experiences.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
