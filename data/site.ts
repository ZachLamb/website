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
  title: 'Lead UI Developer',
  description:
    'Lead UI Developer at Circadence. I lead the UI engineering team, run our agile process, help shape the product roadmap, and ship full-stack features in React and TypeScript.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  availability: 'Open to remote',
  links: {
    resume: '/zach-lamb-resume.pdf',
  },
} as const satisfies SiteConfigShape;

export type SiteConfig = typeof siteConfig;
