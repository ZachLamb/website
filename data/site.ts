export const siteConfig = {
  name: 'Zach Lamb',
  title: 'Senior Software Engineer',
  description:
    'Senior Software Engineer specializing in React, TypeScript, and AI-powered web tools. Certified ScrumMaster with a Human Centered Computing background, building performant applications from cybersecurity platforms to e-commerce at scale.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  /** Work availability signal surfaced to recruiters. null hides the tag. */
  availability: 'Open to remote' as string | null,
  links: {
    github: 'https://github.com/ZachLamb',
    linkedin: 'https://www.linkedin.com/in/lambzachary/',
    /** Optional: URL to resume/CV PDF for "Resume" link in hero and footer */
    resume: undefined as string | undefined,
  },
} as const;

export type SiteConfig = typeof siteConfig;
