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
      'Building LLM and AI-powered web tools for cybersecurity professionals',
      'Developing intelligent interfaces that augment security workflows with generative AI',
      'Architecting front-end systems with TypeScript and React for mission-critical applications',
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
      'Built API and UI table for credit bureau reporting',
      'Created E2E testing framework that uncovered 2 major regression bugs and initiated bi-weekly retrospectives',
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
      'Built multi-million dollar sale promotions powering major revenue events',
      'Created order history feature with React, Redux, and a custom REST API',
      'Developed A/B tests increasing testing coverage by 40%',
    ],
    techStack: ['Vue.js', 'React', 'Redux', 'SASS', 'Docker', 'AWS'],
  },
  {
    id: 'regis-company',
    company: 'The Regis Company',
    position: 'Software Engineer II',
    startDate: 'Nov 2017',
    endDate: 'Nov 2020',
    description: [
      'Contributed to a SPA for award-winning corporate learning experiences',
      'Integrated new Python API reducing load times from 6 seconds to 500ms',
      'Used UX background to improve team collaboration, achieving a 20% productivity increase',
    ],
    techStack: ['React', 'Python', 'MobX'],
  },
  {
    id: 'charter',
    company: 'Charter Communications',
    position: 'Web Developer',
    startDate: 'Jul 2017',
    endDate: 'Nov 2017',
    description: [
      'Developed prototypical dashboard for telecom equipment testing automation',
      'Connected live data feeds with RethinkDB and WebSockets',
      'Conducted user testing that informed the 6-month product roadmap',
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
