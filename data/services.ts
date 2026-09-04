export type ServiceEntry = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

export const services: ServiceEntry[] = [
  {
    id: 'fullstack-architecture',
    title: 'Full-Stack Architecture & Delivery',
    icon: 'code',
    description:
      'I build and ship production React and TypeScript, along with the architecture and performance work that keeps features shipping on schedule.',
  },
  {
    id: 'ai-augmented-engineering',
    title: 'AI-Augmented Engineering',
    icon: 'sparkles',
    description:
      'I embed AI tooling into team workflows: Claude Code in grooming, MCP for roadmap surfacing, shared agent configs. Quality scales without bottlenecking on review.',
  },
  {
    id: 'product-roadmap-strategy',
    title: 'Product & Roadmap Strategy',
    icon: 'compass',
    description:
      "At Circadence, I own the roadmap alongside the engineering work, from discovery through delivery. I've consolidated 400+ loose backlog items into structured projects and built dual roadmaps spanning multiple teams.",
  },
  {
    id: 'process-delivery',
    title: 'Process & Delivery',
    icon: 'users',
    description:
      "Certified ScrumMaster who builds the sprint cadence, retros, and cross-functional rhythms that let teams ship reliably. I've designed hiring processes adopted company-wide.",
  },
];
