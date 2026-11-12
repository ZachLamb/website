'use client';

import { ExternalLink, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { publishedProjects } from '@/data/projects';
import type { Project } from '@/data/projects';
import { waypointNumber } from '@/lib/waypoints';

function ProjectLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blaze hover:text-ink focus-visible:ring-blaze focus-visible:ring-offset-paper inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {icon}
      {label}
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <Card className="flex h-full flex-col p-5 sm:p-6">
        <h3 className="text-ink font-serif text-2xl leading-tight font-semibold">
          {project.title}
        </h3>
        <p className="text-blaze mt-1 text-sm font-medium">{project.tagline}</p>
        <p className="text-ink-soft mt-3 text-base leading-relaxed">{project.description}</p>

        {project.stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        )}

        {(project.links.live || project.links.repo || project.links.writeup) && (
          <div className="border-contour/40 mt-5 flex flex-wrap gap-x-5 border-t pt-2">
            {project.links.live && (
              <ProjectLink
                href={project.links.live}
                label="Live"
                icon={<ExternalLink className="h-4 w-4" aria-hidden />}
              />
            )}
            {project.links.repo && (
              <ProjectLink
                href={project.links.repo}
                label="Repo"
                icon={<GithubIcon className="h-4 w-4" aria-hidden />}
              />
            )}
            {project.links.writeup && (
              <ProjectLink
                href={project.links.writeup}
                label="Write-up"
                icon={<FileText className="h-4 w-4" aria-hidden />}
              />
            )}
          </div>
        )}
      </Card>
    </Reveal>
  );
}

export function Projects() {
  const { messages } = useLocaleContext();

  // Don't render the section at all when nothing is published. Avoids
  // shipping placeholder copy or an empty "intro + grid of nothing."
  // lib/waypoints.ts reads the same hasPublishedProjects flag, so the nav
  // entry, the map marker and the numbering all drop it in lockstep.
  if (publishedProjects.length === 0) return null;

  return (
    <Section id="projects" surface="meadow" after="paper">
      <SectionHeading
        sectionId="projects"
        number={waypointNumber('projects')}
        kicker={messages.kickers.projects}
      >
        {messages.sections.projects}
      </SectionHeading>
      <p className="text-ink-soft mt-4 max-w-2xl text-lg">{messages.projects.intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {publishedProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
