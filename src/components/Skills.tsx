import { useReveal } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";
import { ChatGPTSkillsVisual } from "./ChatGPTSkillsVisual";

const Skills = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="tech" ref={ref} className="py-24 relative z-10 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Skills" />

        {/* Only the encircled ChatGPT 6-Branch Skills Visual */}
        <div className="reveal flex justify-center">
          <ChatGPTSkillsVisual />
        </div>
      </div>
    </section>
  );
};

export default Skills;
