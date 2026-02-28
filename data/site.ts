export const siteConfig = {
  name: 'Zach Lamb',
  title: 'Senior Software Engineer',
  description:
    'Senior Software Engineer specializing in React, TypeScript, and AI-powered web tools. Certified ScrumMaster with a Human Centered Computing background, building performant applications from cybersecurity platforms to e-commerce at scale.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/ZachLamb',
    linkedin: 'https://www.linkedin.com/in/lambzachary/',
  },
} as const;

export type SiteConfig = typeof siteConfig;
