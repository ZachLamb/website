export type ServiceEntry = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

export const services: ServiceEntry[] = [
  {
    id: 'team-leadership',
    title: 'Team Leadership',
    icon: 'users',
    description:
      "I lead the UI team at Circadence: setting frontend direction, reviewing code, and clearing blockers so engineers can ship. I've also designed hiring processes that were adopted company-wide.",
  },
  {
    id: 'agile-delivery',
    title: 'Agile Delivery',
    icon: 'repeat',
    description:
      "Certified ScrumMaster running the sprint cadence, retros, and backlog. At Circadence I turned 400+ loose backlog items into ten structured projects and set up the team's first reliable sprint rhythm.",
  },
  {
    id: 'product-roadmap',
    title: 'Product & Roadmap',
    icon: 'compass',
    description:
      "I work alongside product from discovery through delivery and bring the engineering view into roadmap decisions. I've built dual roadmaps that keep software and hardware teams pointed at the same deliverable.",
  },
  {
    id: 'fullstack-features',
    title: 'Full-Stack Features',
    icon: 'code',
    description:
      "I still build. New features go from React and TypeScript on the front end through to the services behind them, including LLM-powered tools, and I bring AI tooling like Claude Code and MCP into the team's daily workflow.",
  },
];
