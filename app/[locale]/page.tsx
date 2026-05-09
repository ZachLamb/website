import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Endorsements } from '@/components/sections/Endorsements';
import { Skills } from '@/components/sections/Skills';
import { Services } from '@/components/sections/Services';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Divider } from '@/components/ui/Divider';
import { hasPublishedProjects } from '@/data/projects';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Divider variant="mountains" />
      <Experience />
      {/* Projects renders null when nothing is published; the surrounding
          divider would leave an awkward decorative gap, so it's gated too.
          Navbar.tsx applies the same flag to its nav entry. */}
      {hasPublishedProjects && (
        <>
          <Divider variant="trail" />
          <Projects />
        </>
      )}
      <Divider variant="treeline" />
      <Endorsements />
      <Skills />
      <Divider variant="treeline" flip />
      <Services />
      <Divider variant="trail" />
      <Education />
      <Divider variant="mountains" flip />
      <Contact />
    </>
  );
}
