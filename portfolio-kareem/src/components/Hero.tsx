import { useState, useEffect } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { scrollToId } from "@/hooks/use-reveal";

const Hero = () => {
  // Animation stages:
  // 1: Text Reveal (".Data is just numbers")
  // 2: Strike-through (line strikes through ".Data is just numbers")
  // 3: Name Reveal ("Kareem Salah" with gradient)
  // 4: Subtitle Fade-in (".Turning data into intelligence")
  // 5: Bio and buttons reveal
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);   // Text Reveal
    const t2 = setTimeout(() => setStage(2), 1400);  // Strike-through
    const t3 = setTimeout(() => setStage(3), 2200);  // Name Reveal
    const t4 = setTimeout(() => setStage(4), 3000);  // Subtitle Fade-in
    const t5 = setTimeout(() => setStage(5), 3600);  // Bio & Buttons

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const replay = () => {
    setStage(0);
    setTimeout(() => setStage(1), 150);
    setTimeout(() => setStage(2), 1300);
    setTimeout(() => setStage(3), 2100);
    setTimeout(() => setStage(4), 2900);
    setTimeout(() => setStage(5), 3500);
  };

  return (
    <section id="hero" className="min-h-screen flex items-center pt-28 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-14 items-center max-w-6xl mx-auto">
          <div className="space-y-7">
            {/* Stage 1 & 2: Text Reveal & Strike-Through */}
            <div className="flex items-center gap-3">
              <div
                className={`relative inline-block font-mono text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight transition-all duration-700 ${
                  stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span
                  className={`transition-all duration-700 select-none ${
                    stage >= 2 ? "text-muted-foreground/60" : "text-foreground/90"
                  }`}
                >
                  .Data is just numbers
                </span>

                {/* Animated Turquoise Strike-Through Line */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_hsl(var(--primary)/0.75)] pointer-events-none"
                  style={{ width: stage >= 2 ? "100%" : "0%" }}
                />
              </div>

              {stage >= 5 && (
                <button
                  onClick={replay}
                  title="Replay intro animation"
                  aria-label="Replay intro animation"
                  className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-primary transition-colors hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Stage 3: Name Reveal */}
            <h1
              className={`text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight transition-all duration-700 ${
                stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Kareem <span className="text-gradient">Salah</span>
            </h1>

            {/* Stage 4: Subtitle Fade-in */}
            <p
              className={`text-xl md:text-2xl font-mono text-primary font-semibold tracking-tight transition-all duration-700 ${
                stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              .Turning data into intelligence
            </p>

            {/* Stage 5: Bio and Descriptions */}
            <div
              className={`space-y-4 transition-all duration-700 ${
                stage >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-lg md:text-xl text-foreground/90 font-medium">
                Building Intelligent Solutions That Meet Your Needs.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-xl">
                Computer &amp; AI student at BFCAI with expertise in Data Science, Machine Learning, Graphic Design,
                and Workflow Automation.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div
              className={`flex flex-wrap gap-4 pt-2 transition-all duration-700 ${
                stage >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button
                onClick={() => scrollToId("projects")}
                className="group px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:bg-foreground hover:shadow-tech"
              >
                See my work
                <ArrowDown className="inline ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="px-7 py-3.5 rounded-full border border-border font-semibold transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-tech"
              >
                Say something
              </button>
            </div>
          </div>

          {/* Right Column / Avatar */}
          <div className="relative flex justify-center animate-fade-up">
            <div className="absolute -inset-6 rounded-full bg-primary/30 blur-3xl animate-glow" />
            <img
              src="/lovable-uploads/4f63c602-ef85-419e-a446-c5cb5a5e9639.png"
              alt="Kareem Salah - Data Scientist"
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-full object-cover border-2 border-primary/40"
            />
            <div className="absolute -bottom-4 -left-2 md:left-4 glass rounded-2xl px-5 py-4 font-mono text-3xl font-bold text-primary animate-float shadow-tech">
              &lt;/&gt;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
