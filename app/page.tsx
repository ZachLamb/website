import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Endorsements } from '@/components/sections/Endorsements';
import { Skills } from '@/components/sections/Skills';
import { Services } from '@/components/sections/Services';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Divider } from '@/components/ui/Divider';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Divider variant="mountains" />
      <Experience />
      <Divider variant="trail" />
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
