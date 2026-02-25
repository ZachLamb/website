export type ServiceEntry = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

export const services: ServiceEntry[] = [
  {
    id: "frontend-engineering",
    title: "Frontend Engineering",
    icon: "code",
    description:
      "Building performant, accessible web applications with React, TypeScript, and Next.js",
  },
  {
    id: "ai-powered-tools",
    title: "AI-Powered Web Tools",
    icon: "sparkles",
    description:
      "Developing LLM-powered interfaces for cybersecurity and beyond",
  },
  {
    id: "agile-coaching",
    title: "Agile Coaching",
    icon: "users",
    description:
      "Certified ScrumMaster who builds processes that help teams ship better software",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    icon: "palette",
    description:
      "Bridging design and development with a Human Centered Computing background",
  },
];
