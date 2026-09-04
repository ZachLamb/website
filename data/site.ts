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
    'Lead Full-Stack Developer at Circadence. I ship production React and TypeScript and own the roadmap that decides what gets built next.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  availability: 'Open to remote',
  links: {
    resume: '/zach-lamb-resume.pdf',
  },
} as const satisfies SiteConfigShape;

export type SiteConfig = typeof siteConfig;
