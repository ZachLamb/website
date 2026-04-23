export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  techStack: string[];
};

export const experiences: ExperienceEntry[] = [
  {
    id: 'circadence',
    company: 'Circadence',
    position: 'Sr. Software Engineer',
    startDate: 'Sep 2025',
    endDate: 'Present',
    description: [
      'Building LLM-powered web tools that speed up threat analysis and incident response for cybersecurity professionals',
      'Splitting the role between engineering and product: scoping features with stakeholders, shaping the roadmap, and translating security workflows into shippable UX',
      'Architecting React and TypeScript frontends for mission-critical security apps, integrating generative AI where it measurably improves analyst workflows',
    ],
    techStack: ['TypeScript', 'React', 'AI/LLM'],
  },
  {
    id: 'starbucks',
    company: 'Starbucks',
    position: 'Sr. React Developer',
    startDate: 'Feb 2024',
    endDate: 'Sep 2025',
    description: [
      'Developed message reply and edit features with TypeScript, React, and GraphQL',
      'Upgraded UI libraries raising Lighthouse performance score from 65 to 90',
      'Collaborated across teams on a new web application for store managers and developed Agile processes',
    ],
    techStack: ['TypeScript', 'React', 'GraphQL', 'Apollo Client'],
  },
  {
    id: 'stellarfi',
    company: 'StellarFi',
    position: 'Senior Software Engineer',
    startDate: 'May 2023',
    endDate: 'Jan 2024',
    description: [
      'Created a new design system for a brand refresh, driving 100 new users per week improvement',
      'Pair-programmed an API and UI table with my manager to show users how their monthly membership payments were being reported to credit bureaus',
      'Built an E2E testing framework that uncovered two major regression bugs in the production account-creation flow',
      'Initiated and facilitated bi-weekly retrospectives for the engineering team, leading to a documentation-focused sprint and broader process improvements',
    ],
    techStack: ['TypeScript', 'React', 'E2E Testing'],
  },
  {
    id: 'sana-benefits',
    company: 'Sana Benefits',
    position: 'Software Engineer',
    startDate: 'Oct 2022',
    endDate: 'Feb 2023',
    description: [
      'Built healthcare plan selection feature for members',
      'Acted as Agile Coach teaching Scrum practices to the team',
      'Created standardized testing process improving code reliability',
    ],
    techStack: ['React', 'Jest', 'SASS', 'Ruby on Rails'],
  },
  {
    id: 'purple',
    company: 'Purple',
    position: 'Senior Software Engineer',
    startDate: 'Nov 2020',
    endDate: 'Sep 2022',
    description: [
      'Built multi-million dollar sale promotions powering major revenue events using Vue.js, YAML, SASS, Docker, and AWS',
      'Created the order-history feature with React, Redux, a custom REST microservice, Commerce Tools, and AWS Cognito as part of a larger Purple customer-accounts initiative',
      'Developed A/B tests for the cart checkout flow with React, Redux, and the Google Places API, lifting test coverage across the codebase by 40% using Jest and React Testing Library',
    ],
    techStack: ['Vue.js', 'React', 'Redux', 'SASS', 'Docker', 'AWS', 'Commerce Tools'],
  },
  {
    id: 'regis-company',
    company: 'The Regis Company',
    position: 'Software Engineer II',
    startDate: 'Nov 2017',
    endDate: 'Nov 2020',
    description: [
      'Contributed to a SPA powering award-winning corporate learning experiences alongside a small cross-disciplinary startup team',
      'Integrated a new Python API that cut project load times from 6 seconds to 500ms',
      'Met with clients alongside product owners to refine technical user requirements, reducing project scopes by 30% as measured by Agile story points',
      'Used my UX background to bridge UX, Dev, and Product teams, driving a 20% productivity increase as measured by burndown charts',
    ],
    techStack: ['React', 'Python', 'MobX'],
  },
  {
    id: 'charter',
    company: 'Charter Communications',
    position: 'Web Developer (Contract)',
    startDate: 'Jul 2017',
    endDate: 'Nov 2017',
    description: [
      'Developed a prototypical dashboard for automating tests on telecommunications equipment using React, Redux, and Webpack',
      'Partnered with a backend engineer to wire the dashboard to live data via RethinkDB and WebSockets',
      'Conducted user testing that informed the product roadmap for the following six months',
    ],
    techStack: ['React', 'Redux', 'WebSockets', 'RethinkDB'],
  },
  {
    id: 'freelance',
    company: 'Freelance Designer',
    position: 'Freelance Designer',
    startDate: 'Jan 2017',
    endDate: 'Jul 2017',
    description: [
      'Helped clients with animation and UI design needs',
      'Delivered polished visual assets and interactive prototypes',
    ],
    techStack: [],
  },
  {
    id: 'playful-computation',
    company: 'Lab for Playful Computation',
    position: 'UI/UX Developer',
    startDate: 'Sep 2015',
    endDate: 'May 2017',
    description: [
      'Developed lab website, Android app, and product website',
      'Created graphics for NSF proposals — won all submitted grants',
      'Led marketing efforts for a university hackathon',
    ],
    techStack: ['Jekyll', 'HTML', 'CSS', 'jQuery', 'Android'],
  },
  {
    id: 'cu-boulder-it',
    company: 'CU Boulder IT / MCDB',
    position: 'Technical Support',
    startDate: 'Sep 2014',
    endDate: 'Apr 2016',
    description: [
      'Improved scientific technology troubleshooting workflows',
      'Developed a lab website and built a web app tracking department printer charges',
    ],
    techStack: ['HTML', 'CSS', 'Django', 'MySQL', 'Git'],
  },
];
