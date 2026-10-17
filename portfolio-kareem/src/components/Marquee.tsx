const items = ["Python", "Machine Learning", "SQL", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "n8n", "Jupyter", "Kaggle", "C++", "Java"];

const Marquee = () => (
  <div aria-hidden="true" className="relative overflow-hidden py-6 border-y border-border/60 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
    <div className="marquee-track flex w-max gap-4 animate-marquee">
      {[...items, ...items].map((t, i) => (
        <span
          key={i}
          className="px-5 py-2 rounded-full border border-border bg-muted/60 text-sm font-medium text-muted-foreground whitespace-nowrap transition-all hover:-translate-y-1 hover:text-primary hover:border-primary/60"
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

export default Marquee;
