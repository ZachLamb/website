export const siteConfig = {
  name: 'Zach Lamb',
  title: 'Technical Product Manager',
  description:
    'Technical Product Manager specializing in React, TypeScript, and AI-powered product development. Certified ScrumMaster building high-scale cybersecurity tools, leading engineering teams, and owning technical partnerships. Human Centered Computing background.',
  url: 'https://zachlamb.io',
  ogImage: '/og.png',
  /** Work availability signal surfaced to recruiters. null hides the tag. */
  availability: 'Open to remote' as string | null,
  links: {
    github: 'https://github.com/ZachLamb',
    linkedin: 'https://www.linkedin.com/in/lambzachary/',
    /** URL to resume/CV PDF for "Resume" link in hero and footer.
     *  Regenerate via `python3 scripts/generate-resume.py`. */
    resume: '/zach-lamb-resume.pdf' as string | undefined,
  },
} as const;

export type SiteConfig = typeof siteConfig;
