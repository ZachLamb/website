import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

/** Shared map from social platform icon key to SVG component. */
export const socialIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
};
