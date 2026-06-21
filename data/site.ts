interface SiteLinks {
  resume?: string;
}

interface SiteConfigShape {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  availability: string | null;
  links: SiteLinks;
}

export const siteConfig = {
  name: 'Zach Lamb',
  title: 'Technical Product Manager',
  description:
    'Technical Product Manager who owns the roadmap, runs the team, and goes deep on the technical decisions that matter. React, TypeScript, and AI-powered product development. Certified ScrumMaster with a Human Centered Computing background.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  availability: 'Open to remote',
  links: {
    resume: '/zach-lamb-resume.pdf',
  },
} as const satisfies SiteConfigShape;

export type SiteConfig = typeof siteConfig;
