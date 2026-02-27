import { education, certifications } from './education';

describe('education', () => {
  it('should have 2 education entries', () => {
    expect(education).toHaveLength(2);
  });

  it('first entry should be CU Boulder', () => {
    expect(education[0].id).toBe('cu-boulder');
    expect(education[0].institution).toBe('University of Colorado Boulder');
  });

  it('each entry should have required fields', () => {
    education.forEach((entry) => {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('institution');
      expect(entry).toHaveProperty('degree');
      expect(entry).toHaveProperty('startYear');
      expect(entry).toHaveProperty('endYear');
    });
  });
});

describe('certifications', () => {
  it('should have at least 1 certification', () => {
    expect(certifications.length).toBeGreaterThanOrEqual(1);
  });

  it('CSM certification should exist with correct issuer', () => {
    const csm = certifications.find((c) => c.id === 'csm');
    expect(csm).toBeDefined();
    expect(csm?.name).toBe('Certified ScrumMaster (CSM)');
    expect(csm?.issuer).toBe('Scrum Alliance');
  });
});
