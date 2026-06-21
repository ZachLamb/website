export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  techStack: string[];
  featured: boolean;
};

export const experiences: ExperienceEntry[] = [
  {
    id: 'circadence',
    company: 'Circadence',
    position: 'Technical Product Manager',
    startDate: 'Sep 2025',
    endDate: 'Present',
    description: [
      'Rebuilt the team’s delivery infrastructure from scratch: consolidated 409 backlog items into 10 structured Linear projects and established the first reliable sprint cadence, grooming, and retro process the team had',
      'Serve as engagement manager and primary technical counterpart for the NTT Data Japan enterprise partnership, a multi-year contract central to Circadence’s international expansion, coordinating across multiple software teams and a hardware team toward the June 2026 Basic Design deliverable',
      'Designed a four-stage interview process now adopted company-wide; actively hiring Sr. FE Dev, UX Designer, and Sr. BE Dev',
      'Introduced AI-augmented engineering practices across the team: Claude Code in grooming, MCP tooling for roadmap surfacing, shared agent configs to scale code quality without bottlenecking on review; consistently adopting the latest AI tooling as it ships',
      'Built and maintain dual roadmaps in Linear: an internal team roadmap and a shared cross-functional roadmap spanning two software teams and a hardware team',
      'Delivered major frontend features end-to-end as IC in React and TypeScript, including Prefabs, Home Page Redesign, and a UI overhaul supporting 300+ node environments',
      'Modernized the frontend toolchain to Vite and TypeScript and co-led architectural direction with the backend technical lead',
    ],
    techStack: [
      'Technical Product Management',
      'Roadmap Ownership',
      'React',
      'TypeScript',
      'AI/LLM',
      'Cross-functional Leadership',
      'Agile',
    ],
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
    featured: false,
  },
  {
    id: 'gogo-business-aviation',
    company: 'Gogo Business Aviation',
    position: 'UI/UX Software Engineering Intern',
    startDate: 'May 2016',
    endDate: 'Aug 2016',
    description: [
      'Implemented major product features on a MEAN-stack app in a pair-programming team',
      'Collaborated with Product and QA to design the end-user interface',
      'Wrote end-to-end tests with Mocha.js',
    ],
    techStack: ['MongoDB', 'Express', 'Angular', 'Node.js', 'Mocha.js'],
    featured: false,
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
    featured: false,
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
    featured: false,
  },
];
