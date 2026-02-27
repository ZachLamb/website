import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
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
      <Divider />
      <Experience />
      <Skills />
      <Divider className="border-bark/10" />
      <Services />
      <Divider />
      <Education />
      <Divider />
      <Contact />
    </>
  );
}
