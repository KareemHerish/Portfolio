import { useReveal } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

const About = () => {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="about" ref={ref} className="py-28">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle tag="01 / about" title="About Me" />
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10">
          <p className="reveal text-2xl md:text-3xl font-semibold leading-snug" style={{ fontFamily: "Sora" }}>
            Empirical clarity — <span className="text-gradient">zero guesswork.</span>
          </p>
          <div className="reveal space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              I distill high-dimensional data into decisive insights and strategic leverage. Studying AI at BFCAI, I work at the convergence of statistical rigor, machine learning, and clean visual design.
            </p>
            <p>
              Disciplined, agile, and methodical—I engineer predictive systems, streamline complex workflows, and build intelligent data solutions engineered for speed, clarity, and measurable impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
