const SectionTitle = ({ title, sub }: { tag?: string; title: string; sub?: string }) => (
  <div className="reveal mb-14">
    <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
    {sub && <p className="text-muted-foreground text-lg mt-4 max-w-2xl">{sub}</p>}
  </div>
);

export default SectionTitle;
