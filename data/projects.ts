// Selected Work section data. Grounded in public repos — refine titles/
// descriptions for accuracy before shipping, and add 1-2 live-link
// projects if any exist (recruiters value "I can click it and see it work"
// more than "here's the repo").

export type Project = {
  id: string;
  title: string;
  tagline: string; // 1-line problem statement
  stack: string[];
  links: {
    live?: string;
    repo?: string;
    writeup?: string;
  };
  /** Keep to ~120 chars for layout rhythm. */
  description: string;
};

export const projects: Project[] = [
  {
    id: 'budget-app',
    title: 'Clarity',
    tagline: 'Private household budget app with an AI advisor',
    stack: ['Next.js', 'TypeScript', 'Anthropic API'],
    links: {
      repo: 'https://github.com/ZachLamb/budget-app',
    },
    description:
      'A budgeting tool that tracks spend locally and layers an LLM advisor on top for conversational month-end review and category suggestions.',
  },
  {
    id: 'nutrition-counter',
    title: 'Nutrition Counter',
    tagline: 'LLM-assisted macro / calorie tracking',
    stack: ['Ruby on Rails', 'LLM'],
    links: {
      repo: 'https://github.com/ZachLamb/nutrition_counter_backend',
    },
    description:
      'Backend service that parses natural-language meal descriptions into tracked macros and calories — showing up a year before this was commodity.',
  },
  {
    id: 'noted',
    title: 'Noted — Pick a Song',
    tagline: 'Music-discovery assistant',
    stack: ['React', 'Node.js'],
    links: {
      repo: 'https://github.com/ZachLamb/noted',
    },
    description:
      'Helps people choose new music to listen to based on what they say they are in the mood for.',
  },
  // TODO (zach): review/replace these with your strongest 3-5 projects.
  // Ideal: 1-2 with live links + measurable outcomes, at least one with LLM/AI work.
];
