import { Users, Rocket, Compass, Calendar, CheckCircle2, Award } from "lucide-react";
import { useReveal, trackSpotlight } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

const activities = [
  {
    id: "nasa-space-apps",
    org: "NASA Space Apps Cairo",
    role: "Hackathon Participant",
    period: "Oct 2025",
    icon: Rocket,
    tag: "Global Hackathon",
    bullets: [
      "Tackled NASA's Climate Change Challenge by developing machine learning models to analyze complex environmental datasets.",
      "Collaborated in a multidisciplinary team under rapid hackathon sprints to deliver data-backed climate solutions.",
    ],
  },
  {
    id: "student-union",
    org: "Student Union",
    role: "AI Committee Member & Coordinator",
    period: "Jul 2025 – Sep 2025",
    icon: Users,
    tag: "Leadership & Community",
    bullets: [
      "Spearheaded technical initiatives and structured training schedules for the AI committee.",
      "Delivered interactive technical workshops and mentored peers across varied skill levels.",
      "Strengthened project management, event coordination, and peer-to-peer knowledge sharing.",
    ],
  },
  {
    id: "ieee-bub",
    org: "IEEE BUB SB",
    role: "Active Member",
    period: "Oct 2025 – Dec 2025",
    icon: Compass,
    tag: "Technical Society",
    bullets: [
      "Contributed to student branch engineering seminars and community-driven technology initiatives.",
      "Collaborated with fellow engineers to foster continuous technical learning and technical outreach.",
    ],
  },
];

const Volunteering = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="volunteering" ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Volunteering" />

        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onMouseMove={trackSpotlight}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className="reveal spotlight lift rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl p-7 flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-tech"
              >
                <div>
                  {/* Period & Tag */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-4">
                    <span className="flex items-center gap-1.5 font-mono text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.period}
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded-md border border-border/60">
                      {item.tag}
                    </span>
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-snug">
                        {item.org}
                      </h3>
                      <p className="text-primary font-medium text-sm mt-0.5">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed mt-4">
                    {item.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
