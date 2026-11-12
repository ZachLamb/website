import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Endorsements } from '@/components/sections/Endorsements';
import { Skills } from '@/components/sections/Skills';
import { Services } from '@/components/sections/Services';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';

// Each section draws its own top edge (see the `after` prop on Section), so
// there are no separate divider elements between them. Projects renders
// nothing until a project is published.
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Endorsements />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
