import Header from "@/components/Header";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Volunteering from "@/components/Volunteering";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Path from "@/components/Path";
import Contact from "@/components/Contact";

const Index = () => (
  <div className="relative min-h-screen isolate">
    <BackgroundCanvas />
    <Header />
    <main>
      <Hero />
      <About />
      <Experience />
      <Education />
      <Volunteering />
      <Skills />
      <Projects />
      <Path />
      <Contact />
    </main>
  </div>
);

export default Index;
