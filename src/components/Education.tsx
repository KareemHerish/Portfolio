import { GraduationCap } from "lucide-react";
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Benha University
                </h3>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary border border-primary/20">
                  BFCAI
                </span>
              </div>

              <p className="text-lg md:text-xl text-primary font-semibold">
                B.Sc. in Computer Science
              </p>

              <div className="space-y-2 text-sm md:text-base text-muted-foreground pt-1">
                <p>
                  Specialization:{" "}
                  <strong className="text-foreground">Artificial Intelligence (AI)</strong>
                </p>
                <p className="font-medium text-foreground">
                  <span className="text-muted-foreground">Graduation year: </span>
                  <span className="font-semibold text-foreground">2027</span>
                </p>
              </div>
            </div>

            {/* Right: GPA text without box */}
            <div className="flex-shrink-0 self-start md:self-center text-left md:text-right">
              <span className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                GPA
              </span>
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-primary">
                3.71
                <span className="text-base md:text-lg font-normal text-muted-foreground ml-1">
                  / 4.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;

