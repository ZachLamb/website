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
  title: 'Lead Full-Stack Developer',
  description:
    'Lead Full-Stack Developer shipping production React, TypeScript, and the systems behind them — with technical product management folded into the role at Circadence: roadmap ownership, delivery, and cross-team coordination. AI-powered product development, human-centered design background, Certified ScrumMaster.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  availability: 'Open to remote',
  links: {
    resume: '/zach-lamb-resume.pdf',
  },
} as const satisfies SiteConfigShape;

export type SiteConfig = typeof siteConfig;
