import { useReveal, trackSpotlight } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

const Education = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="education" ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Education" />

        <div
          onMouseMove={trackSpotlight}
          className="reveal spotlight lift rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl p-8 md:p-10 transition-all duration-300 hover:border-primary/50 hover:shadow-tech"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Benha University
            </h3>
            <p className="text-lg md:text-xl text-primary font-semibold mt-1">
              B.Sc. in Computer Science
            </p>
            <div className="text-muted-foreground font-medium text-sm md:text-base mt-3 flex flex-wrap items-center gap-y-2 gap-x-3">
              <span>
                Specialization: <strong className="text-foreground">Artificial Intelligence (AI)</strong>
              </span>
              <span>•</span>
              <span className="text-foreground font-medium">Expected 2027</span>
              <span>•</span>
              <span className="font-mono text-primary font-semibold">GPA: 3.71 / 4.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
