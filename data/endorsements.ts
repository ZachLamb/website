export type Endorsement = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  context?: string;
};

/**
 * Your latest three LinkedIn recommendations.
 * 1. Go to https://www.linkedin.com/in/lambzachary/details/recommendations/
 * 2. Copy the full quote, recommender name, their title/company, and context (e.g. "Worked together at X") for each of your three most recent recommendations.
 * 3. Paste below, one recommendation per object.
 */
export const endorsements: Endorsement[] = [
  {
    id: '1',
    quote:
      'Paste your first (most recent) LinkedIn recommendation quote here. Replace this entire string with the full text from LinkedIn.',
    author: 'Recommender full name',
    role: 'Their Title, Company',
    context: 'e.g. Worked together at Company Name',
  },
  {
    id: '2',
    quote:
      'Paste your second LinkedIn recommendation quote here. Replace with the full text from LinkedIn.',
    author: 'Recommender full name',
    role: 'Their Title, Company',
    context: 'e.g. Zach reported to me at Company',
  },
  {
    id: '3',
    quote:
      'Paste your third LinkedIn recommendation quote here. Replace with the full text from LinkedIn.',
    author: 'Recommender full name',
    role: 'Their Title, Company',
    context: 'e.g. Collaborated on project X',
  },
];
