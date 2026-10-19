import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Award } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

/* ------------------------------------------------------------------ */
/*  Data: the FIRST item is the top step (the summit), the LAST item   */
/*  is the bottom step. Reverse the array to flip the climb.           */
/* ------------------------------------------------------------------ */
const CERTS = [
  { name: "LLMs Certificate", issuer: "Tips Hindawi" },
  { name: "Petrobel Certificate", issuer: "Belayim Petroleum Company" },
  { name: "Machine Learning for Data Analysis", issuer: "NTI" },
  { name: "HCIA-AI Fundamentals", issuer: "Huawei" },
  { name: "AI & Data Science Program", issuer: "ITI" },
  { name: "Deep Learning", issuer: "Mahara Tech (MCIT)" },
  { name: "Machine Learning Training", issuer: "NTI" },
  { name: "Machine Learning Specialization", issuer: "LinkedIn Learning" },
  { name: "Python Programming", issuer: "Mahara Tech (MCIT)" },
];

/* ------------------------------------------------------------------ */
/*  Staircase geometry                                                 */
/* ------------------------------------------------------------------ */
const N = CERTS.length;
const CARD_H = 96; // px
const GAP = 20; // px
const PITCH = CARD_H + GAP;
const TOTAL_H = N * CARD_H + (N - 1) * GAP;

// Horizontal position (0..3) of each step: climbs right, turns, climbs left, turns, and so on.
const posOf = (d: number) => {
  const s = N - 1 - d; // steps counted from the bottom
  const k = s % 6;
  return k <= 3 ? k : 6 - k;
};

const cy = (d: number) => d * PITCH + CARD_H / 2;
const gapY = (d: number) => d * PITCH + CARD_H + GAP / 2; // gap between step d and d+1

// Circuit-style trace through every step, drawn from the bottom step up to the top one.
const railPath = (cx: (pos: number) => number) => {
  let path = `M ${cx(posOf(N - 1))} ${cy(N - 1)}`;
  for (let d = N - 2; d >= 0; d--) {
    path += ` V ${gapY(d)} H ${cx(posOf(d))} V ${cy(d)}`;
  }
  return path;
};

// Card centers as a percentage of the container width (must match the card classes below).
const DESKTOP_RAIL = railPath((p) => p * 20 + 20); // width 40%, offset 20% per position
const MOBILE_RAIL = railPath((p) => p * 7.33 + 39); // width 78%, offset 7.33% per position

const CSS = `
.cs-flow{stroke-dasharray:4 8;animation:cs-flow 1.2s linear infinite}
@keyframes cs-flow{to{stroke-dashoffset:-12}}
@media (prefers-reduced-motion:reduce){.cs-flow{animation:none}}
`;

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Certifications = () => {
  const ref = useReveal<HTMLElement>();
  const stairsRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Build the staircase from the bottom up once it scrolls into view.
  useEffect(() => {
    const el = stairsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const railProps = {
    fill: "none",
    stroke: "hsl(var(--primary))",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  } as const;

  return (
    <section id="certifications" ref={ref} className="py-24 relative z-10 bg-background overflow-hidden">
      <style>{CSS}</style>
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Certifications" />
        <p className="-mt-4 mb-12 max-w-xl text-muted-foreground">
          Courses and programs certifications across AI
        </p>

        <div className="reveal">
          <div ref={stairsRef} className="relative" style={{ height: TOTAL_H }}>
            {/* Trace running up the stairs */}
            {[
              { d: MOBILE_RAIL, cls: "md:hidden" },
              { d: DESKTOP_RAIL, cls: "hidden md:block" },
            ].map(({ d, cls }) => (
              <svg
                key={cls}
                aria-hidden="true"
                viewBox={`0 0 100 ${TOTAL_H}`}
                preserveAspectRatio="none"
                className={`pointer-events-none absolute inset-0 h-full w-full ${cls}`}
              >
                <path d={d} {...railProps} strokeWidth="1" strokeOpacity="0.2" />
                <path d={d} {...railProps} strokeWidth="1.5" strokeOpacity="0.7" className="cs-flow" />
              </svg>
            ))}

            <ol aria-label="Certifications" className="relative m-0 flex list-none flex-col p-0" style={{ gap: GAP }}>
              {CERTS.map((c, d) => {
                const summit = d === 0;
                const delay = (N - 1 - d) * 110; // bottom step appears first
                return (
                  <li
                    key={c.name}
                    className={`ml-[calc(var(--pos)*7.33%)] w-[78%] transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:ml-[calc(var(--pos)*20%)] md:w-[40%] ${
                      shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                    style={{ "--pos": posOf(d), height: CARD_H, transitionDelay: `${delay}ms` } as CSSProperties}
                  >
                    <div
                      className={`flex h-full items-center gap-3 rounded-xl border border-t-[3px] bg-card p-4 transition-colors hover:border-primary/60 ${
                        summit
                          ? "border-primary/50 border-t-primary shadow-lg shadow-primary/10"
                          : "border-border border-t-primary/60"
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Award className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold leading-snug text-foreground md:text-base">{c.name}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{c.issuer}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
