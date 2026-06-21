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
      'I own the roadmap from discovery to delivery, balancing technical constraints with business outcomes. I\'ve consolidated 400+ backlog items into structured projects and built dual roadmaps spanning multiple teams.',
  },
  {
    id: 'ai-augmented-engineering',
    title: 'AI-Augmented Engineering',
    icon: 'sparkles',
    description:
      'I embed AI tooling into team workflows — Claude Code in grooming, MCP for roadmap surfacing, shared agent configs — so quality scales without bottlenecking on review.',
  },
  {
    id: 'process-delivery',
    title: 'Process & Delivery',
    icon: 'users',
    description:
      'Certified ScrumMaster who builds the sprint cadence, retros, and cross-functional rhythms that let teams ship reliably. I\'ve designed hiring processes adopted company-wide.',
  },
  {
    id: 'engineering-product-bridge',
    title: 'Engineering ↔ Product Bridge',
    icon: 'code',
    description:
      'I go deep on React, TypeScript, and system architecture when the work calls for it, so product decisions stay technically grounded.',
  },
];
