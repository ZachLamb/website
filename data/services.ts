export type ServiceEntry = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

export const services: ServiceEntry[] = [
  {
    id: 'technical-product-strategy',
    title: 'Technical Product Strategy',
    icon: 'compass',
    description:
      'I own the roadmap from discovery through delivery. At Circadence that meant turning 409 loose backlog items into ten projects a team could actually plan against.',
  },
  {
    id: 'ai-augmented-engineering',
    title: 'AI-Augmented Engineering',
    icon: 'sparkles',
    description:
      'I put AI tooling where the team already works: Claude Code in grooming sessions, MCP for surfacing roadmap context, shared agent configs so nobody starts from scratch.',
  },
  {
    id: 'process-delivery',
    title: 'Process & Delivery',
    icon: 'users',
    description:
      "Certified ScrumMaster. I set up the sprint cadence and retros that make delivery predictable, and I've built hiring processes that got adopted company-wide.",
  },
  {
    id: 'engineering-product-bridge',
    title: 'Engineering ↔ Product Bridge',
    icon: 'code',
    description:
      "When the work calls for it I'm still in React and TypeScript myself, which keeps product decisions honest about what the build actually costs.",
  },
];
