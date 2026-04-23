'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';

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
      className="text-gold hover:text-copper focus-visible:ring-gold focus-visible:ring-offset-parchment inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {icon}
      {label}
    </a>
  );
}

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: Project;
  index: number;
  isInView: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card variant="map" className="flex h-full flex-col">
        <h3 className="text-forest font-serif text-xl font-semibold">{project.title}</h3>
        <p className="text-stone mt-1 text-sm">{project.tagline}</p>
        <p className="text-bark mt-3 text-sm leading-relaxed">{project.description}</p>

        {project.stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech, j) => (
              <m.span
                key={tech}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3, delay: 0.2 + j * 0.05 }}
                className="inline-block"
              >
                <Badge>{tech}</Badge>
              </m.span>
            ))}
          </div>
        )}

        {(project.links.live || project.links.repo || project.links.writeup) && (
          <div className="border-bark/10 mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4">
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
    </m.div>
  );
}

export function Projects() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Section variant="light" id="projects" mapFrame nature={{ leaves: true }}>
      <div ref={ref}>
        <AnimatedHeading sectionId="projects" subtitle="IIb." className="mb-4">
          {messages.sections.projects}
        </AnimatedHeading>
        <p className="text-bark mb-10 max-w-2xl text-lg">{messages.projects.intro}</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </Section>
  );
}
