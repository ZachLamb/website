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
    'Technical Product Manager specializing in React, TypeScript, and AI-powered product development. Certified ScrumMaster building high-scale cybersecurity tools, leading engineering teams, and owning technical partnerships. Human Centered Computing background.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  availability: 'Open to remote',
  links: {
    resume: '/zach-lamb-resume.pdf',
  },
} as const satisfies SiteConfigShape;

export type SiteConfig = typeof siteConfig;
