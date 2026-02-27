export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startYear: number;
  endYear: number;
  details: string[];
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
};

export const education: EducationEntry[] = [
  {
    id: 'cu-boulder',
    institution: 'University of Colorado Boulder',
    degree: 'B.S. Computer Science',
    field: 'Human Centered Computing',
    startYear: 2014,
    endYear: 2017,
    details: [
      'Focus: Human Centered Computing',
      'Minor in Technology, Arts, and Media (ATLAS Institute)',
      'Notable courses: Data Mining, User Centered Design, Object-Oriented Design & Analysis, Mobile Development',
    ],
  },
  {
    id: 'frcc',
    institution: 'Front Range Community College',
    degree: 'A.S.',
    startYear: 2012,
    endYear: 2014,
    details: [],
  },
];

export const certifications: CertificationEntry[] = [
  {
    id: 'csm',
    name: 'Certified ScrumMaster (CSM)',
    issuer: 'Scrum Alliance',
    issuedDate: 'Oct 2020',
  },
];
