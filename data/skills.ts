export type SkillWithYears = {
  name: string;
  years: number;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: SkillWithYears[];
};

/**
 * Skills with years of professional experience (derived from work history).
 * Update years as your experience grows.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    skills: [
      { name: 'React', years: 8 },
      { name: 'TypeScript', years: 4 },
      { name: 'Next.js', years: 2 },
      { name: 'Vue.js', years: 2 },
      { name: 'GraphQL', years: 2 },
      { name: 'Redux', years: 2 },
      { name: 'HTML/CSS', years: 10 },
      { name: 'SASS', years: 3 },
      { name: 'Tailwind CSS', years: 3 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    skills: [
      { name: 'Ruby on Rails', years: 1 },
      { name: 'Python', years: 3 },
      { name: 'Django', years: 2 },
      { name: 'Node.js', years: 4 },
    ],
  },
  {
    id: 'tools-infrastructure',
    name: 'Tools & Infrastructure',
    skills: [
      { name: 'Docker', years: 2 },
      { name: 'AWS', years: 2 },
      { name: 'Git', years: 10 },
      { name: 'Jest', years: 3 },
      { name: 'Cypress', years: 1 },
      { name: 'Webpack', years: 3 },
    ],
  },
  {
    id: 'practices',
    name: 'Practices',
    skills: [
      { name: 'Agile/Scrum', years: 8 },
      { name: 'Product Design', years: 6 },
      { name: 'UI/UX', years: 10 },
      { name: 'E2E Testing', years: 2 },
      { name: 'AI/LLM Integration', years: 1 },
    ],
  },
];

/** Max years used for bar scale (for consistent infographic proportions) */
export const maxYearsForScale = 10;
