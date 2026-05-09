// Selected Work content. The site auto-hides this entire section (and its
// nav entry) when no projects are published, so leaving the array empty
// during the in-between state is the right default — you don't ship
// placeholder copy to recruiters.
//
// To add a real project, add an entry with `published: true`. The section
// shape and the data-integrity tests in data/projects.test.ts will guide
// the required fields. Recruiters value live links over repos; aim for at
// least one project with `links.live` set.
//
// Reference structure (was committed earlier as placeholder seeds; kept here
// as a copy-paste template for when real projects land):
//
//   {
//     id: 'budget-app',
//     title: 'Clarity',
//     tagline: 'Private household budget app with an AI advisor',
//     stack: ['Next.js', 'TypeScript', 'Anthropic API'],
//     links: { repo: 'https://github.com/ZachLamb/budget-app' },
//     description:
//       'A budgeting tool that tracks spend locally and layers an LLM advisor on top for conversational month-end review.',
//     published: false,
//   }

export type Project = {
  id: string;
  title: string;
  /** 1-line problem statement. */
  tagline: string;
  stack: string[];
  links: {
    live?: string;
    repo?: string;
    writeup?: string;
  };
  /** Keep to ~120 chars for layout rhythm. */
  description: string;
  /**
   * Set true when ready to render publicly. Defaults to false on every entry
   * so half-finished projects never accidentally ship to a recruiter view.
   */
  published: boolean;
};

export const projects: Project[] = [];

/** Projects that should render publicly. */
export const publishedProjects: Project[] = projects.filter((p) => p.published);

/** True when the Selected Work section has anything to render. */
export const hasPublishedProjects: boolean = publishedProjects.length > 0;
