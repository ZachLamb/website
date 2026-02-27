export type SkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Vue.js',
      'GraphQL',
      'Redux',
      'HTML/CSS',
      'SASS',
      'Tailwind CSS',
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    skills: ['Ruby on Rails', 'Python', 'Django', 'Node.js'],
  },
  {
    id: 'tools-infrastructure',
    name: 'Tools & Infrastructure',
    skills: ['Docker', 'AWS', 'Git', 'Jest', 'Cypress', 'Webpack'],
  },
  {
    id: 'practices',
    name: 'Practices',
    skills: ['Agile/Scrum', 'Product Design', 'UI/UX', 'E2E Testing', 'AI/LLM Integration'],
  },
];
