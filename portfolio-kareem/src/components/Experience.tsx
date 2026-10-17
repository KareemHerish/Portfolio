import {
  Brain,
  Building2,
  Cpu,
  Sparkles,
  Calendar,
  MapPin,
  Globe,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { useReveal, trackSpotlight } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: "Remote" | "In-Person";
  icon: typeof Brain;
  brief: string;
  bullets: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: "tips-hindawi",
    role: "AI / Large Language Models (LLMs) Trainee",
    company: "TIPS Hindawi",
    period: "Aug 2026 – Oct 2026",
    location: "Remote",
    icon: Sparkles,
    brief: "Architected RAG systems and deployed context-aware LLM solutions.",
    bullets: [
      "Engineered Retrieval-Augmented Generation (RAG) pipelines using LangChain, vector databases, and Hugging Face embeddings.",
      "Optimized and evaluated state-of-the-art models (Mistral, GPT, Claude) via advanced prompt engineering and deployed web interfaces with Streamlit.",
    ],
  },
  {
    id: "petrobel",
    role: "Software & IT Systems Trainee",
    company: "Petrobel (Belayim Petroleum Company)",
    period: "Aug 2026 – Sep 2026",
    location: "In-Person",
    icon: Building2,
    brief: "Analyzed mission-critical enterprise workflows in the oil & gas industry.",
    bullets: [
      "Studied enterprise software architectures and IT operations supporting large-scale petroleum extraction and logistics.",
      "Collaborated across cross-disciplinary technical teams to optimize internal data workflows and operational efficiency.",
    ],
  },
  {
    id: "nti-ml",
    role: "Machine Learning for Data Analysis",
    company: "National Telecommunication Institute (NTI)",
    period: "Jun 2026 – Aug 2026",
    location: "In-Person",
    icon: Cpu,
    brief: "Engineered production-grade predictive pipelines and ensemble algorithms.",
    bullets: [
      "Implemented supervised & unsupervised algorithms (Random Forests, Gradient Boosting, SVMs, Neural Networks) with scikit-learn & TensorFlow.",
      "Built rigorous preprocessing, EDA, cross-validation, and hyperparameter tuning pipelines on complex industrial datasets.",
    ],
  },
  {
    id: "iti-ai",
    role: "AI & Data Science Trainee",
    company: "Information Technology Institute (ITI)",
    period: "Aug 2025 – Sep 2025",
    location: "Remote",
    icon: Brain,
    brief: "Developed deep learning classification and predictive intelligence pipelines.",
    bullets: [
      "Engineered end-to-end AI/ML workflows spanning data synthesis, cleaning, feature transformation, and neural model development.",
      "Conducted systematic experimentation to optimize accuracy and communicated data-driven milestones to project stakeholders.",
    ],
  },
  {
    id: "nti-foundations",
    role: "Machine Learning Trainee",
    company: "National Telecommunication Institute (NTI)",
    period: "Jul 2025 – Aug 2025",
    location: "Remote",
    icon: Terminal,
    brief: "Constructed reproducible training workflows and data augmentation pipelines.",
    bullets: [
      "Engineered high-accuracy classification and regression models using advanced regularization and feature scaling.",
      "Designed reproducible data preprocessing architectures for high-volume tabular and structured datasets.",
    ],
  },
  {
    id: "outlier-ai",
    role: "AI Model Trainer & Evaluator",
    company: "Outlier",
    period: "Jul 2024 – Aug 2024",
    location: "Remote",
    icon: Sparkles,
    brief: "Aligned frontier LLMs on high-complexity mathematical and logical reasoning.",
    bullets: [
      "Evaluated, ranked, and trained frontier large language models on multi-step mathematical theorems and algorithmic proofs.",
      "Ensured rigorous adherence to RLHF criteria, factual accuracy, and step-by-step reasoning verification.",
    ],
  },
];

const Experience = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Experience" />

        {/* Experience Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onMouseMove={trackSpotlight}
                style={{ transitionDelay: `${idx * 70}ms` }}
                className="reveal spotlight lift rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl p-7 flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-tech"
              >
                <div>
                  {/* Header: Period & Location Badge */}
                  <div className="flex items-center justify-between gap-3 text-xs mb-4">
                    <span className="flex items-center gap-1.5 font-mono text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium bg-muted/60 px-2.5 py-1 rounded-full border border-border/60">
                      {item.location === "Remote" ? (
                        <Globe className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                      )}
                      {item.location}
                    </span>
                  </div>

                  {/* Title and Company */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground leading-snug">
                        {item.role}
                      </h3>
                      <p className="text-primary font-medium text-sm mt-0.5">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Brief punchline */}
                  <p className="text-sm text-foreground/80 font-medium mb-4 italic">
                    "{item.brief}"
                  </p>

                  {/* Concise Bullet Points */}
                  <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                    {item.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                        <span>{bullet}</span>
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

export default Experience;
