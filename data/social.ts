export type SocialLink = {
  platform: string;
  url: string;
  icon: 'github' | 'linkedin';
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/ZachLamb',
    icon: 'github',
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/lambzachary/',
    icon: 'linkedin',
  },
];
