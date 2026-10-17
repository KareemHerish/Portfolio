import { GraduationCap, Briefcase, Award, Globe, Quote } from "lucide-react";
import { useReveal, trackSpotlight } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

const timeline = [
  { icon: GraduationCap, period: "Expected 2027", title: "Computers and Artificial Intelligence", place: "Benha University (BFCAI)", text: "Studying Data Science, Machine Learning, and AI foundations." },
  { icon: Briefcase, period: "Jul 2025 – Aug 2025", title: "Training Program", place: "National Telecommunication Institute (NTI)", text: "Participated in advanced training program focusing on telecommunications and data science applications." },
];

const certifications = ["Flutter Workshop from Skills Area", "GDSC Camp", "HCIA-AI from Huawei", "ML Foundations From LinkedIn Learning", "ML From NTI", "City Blue From Manchester City"];
const languages = [{ name: "Arabic", level: "Native" }, { name: "English", level: "Professional working proficiency" }];
const testimonials = [
  { text: "Kareem demonstrates exceptional analytical thinking and attention to detail in data science projects. His ability to translate complex data patterns into actionable business insights is truly impressive.", author: "Technical Mentor" },
  { text: "A dedicated student with strong problem-solving capabilities. Kareem's strategic approach to machine learning and his disciplined work ethic make him a valuable team member.", author: "Academic Supervisor" },
  { text: "His proficiency in Python and data visualization, combined with his leadership potential, positions him well for a successful career in AI and data science.", author: "Industry Professional" },
];

const Path = () => {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="story" ref={ref} className="py-28">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle tag="04 / path" title="The Path" sub="Education, experience, certifications and what people say." />

        <div className="relative border-l border-border ml-4 space-y-10 mb-20">
          {timeline.map(({ icon: Icon, ...t }, i) => (
            <div key={t.title} className="reveal relative pl-10" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="absolute -left-5 top-0 h-10 w-10 rounded-full bg-background border border-primary/60 grid place-items-center">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <p className="font-mono text-xs text-primary mb-1">{t.period}</p>
              <h3 className="text-xl font-semibold">{t.title}</h3>
              <p className="text-foreground/80">{t.place}</p>
              <p className="text-muted-foreground mt-2 max-w-2xl">{t.text}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 mb-6">
          <div onMouseMove={trackSpotlight} className="reveal spotlight lift rounded-3xl border border-border bg-card/70 p-7">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-5"><Award className="h-5 w-5 text-primary" />Licenses & Certifications</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {certifications.map((c, i) => (
                <li key={c} className="reveal flex items-center gap-3 text-sm p-3 rounded-xl bg-muted/60" style={{ transitionDelay: `${i * 60}ms` }}>
                  <Award className="h-4 w-4 text-accent shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
          <div onMouseMove={trackSpotlight} className="reveal spotlight lift rounded-3xl border border-border bg-card/70 p-7">
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-5"><Globe className="h-5 w-5 text-primary" />Languages</h3>
            <div className="space-y-4">
              {languages.map((l) => (
                <div key={l.name}>
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-muted-foreground">{l.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure key={i} onMouseMove={trackSpotlight} className="reveal spotlight lift rounded-3xl border border-border bg-card/70 p-7" style={{ transitionDelay: `${i * 100}ms` }}>
              <Quote className="h-5 w-5 text-primary mb-4" />
              <blockquote className="text-muted-foreground italic leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-primary">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Path;
