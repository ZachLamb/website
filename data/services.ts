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
      'I build and ship production React, TypeScript, and the systems behind them — architecture, performance, and the day-to-day delivery that gets features out the door.',
  },
  {
    id: 'ai-augmented-engineering',
    title: 'AI-Augmented Engineering',
    icon: 'sparkles',
    description:
      'I embed AI tooling into team workflows — Claude Code in grooming, MCP for roadmap surfacing, shared agent configs — so quality scales without bottlenecking on review.',
  },
  {
    id: 'product-roadmap-strategy',
    title: 'Product & Roadmap Strategy',
    icon: 'compass',
    description:
      "At Circadence, I own the roadmap alongside the engineering work — from discovery to delivery, balancing technical constraints with business outcomes. I've consolidated 400+ backlog items into structured projects and built dual roadmaps spanning multiple teams.",
  },
  {
    id: 'process-delivery',
    title: 'Process & Delivery',
    icon: 'users',
    description:
      "Certified ScrumMaster who builds the sprint cadence, retros, and cross-functional rhythms that let teams ship reliably. I've designed hiring processes adopted company-wide.",
  },
];
