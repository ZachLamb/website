export type Endorsement = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  context?: string;
};

/**
 * Add endorsements from your LinkedIn profile.
 * LinkedIn: Profile → Recommendations (or ask colleagues to add recommendations).
 * You can also paraphrase skill endorsements or testimonials here.
 */
export const endorsements: Endorsement[] = [
  {
    id: '1',
    quote:
      'Zach is an exceptional engineer who brings clarity, empathy, and strong technical skills to every project. A true collaborator.',
    author: 'Colleague Name',
    role: 'Title, Company',
    context: 'Worked together on [project/team]',
  },
  {
    id: '2',
    quote:
      'Great to work with—delivers clean code, clear communication, and always keeps the user in mind.',
    author: 'Colleague Name',
    role: 'Title, Company',
    context: 'Collaborated at [Company]',
  },
  {
    id: '3',
    quote:
      'Brought structure and quality to our frontend. Highly recommend for React and TypeScript work.',
    author: 'Colleague Name',
    role: 'Title, Company',
    context: 'Direct report / peer',
  },
];
