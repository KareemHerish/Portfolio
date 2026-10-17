import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { scrollToId } from "@/hooks/use-reveal";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "volunteering", label: "Volunteering" },
  { id: "tech", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

const Header = () => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const [open, setOpen] = useState(false);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Theme state: dark by default
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const onScroll = () => {
      const current = links.find(({ id }) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r && r.top <= 120 && r.bottom >= 120;
      });
      setActive(current?.id ?? null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = hovered ?? active;
    const el = target ? refs.current[target] : null;
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    else setPill((p) => ({ ...p, visible: false }));
  }, [hovered, active]);

  const go = (id: string) => {
    scrollToId(id);
    setOpen(false);
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="glass rounded-full w-full max-w-4xl border border-primary/35 ring-1 ring-primary/25 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7),0_0_25px_-4px_hsl(var(--primary)/0.3)] bg-card/85 backdrop-blur-2xl transition-all">
        <div className="flex items-center justify-between px-3.5 py-2">
          {/* Logo KS and Dark/Light Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go("hero")}
              aria-label="Back to top"
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold font-mono text-sm grid place-items-center transition-transform hover:scale-110 hover:rotate-6"
            >
              KS
            </button>

            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="h-9 w-9 rounded-full border border-border bg-secondary/80 text-foreground grid place-items-center transition-all hover:scale-110 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-accent transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-primary transition-transform hover:-rotate-12" />
              )}
            </button>
          </div>

          <div className="relative hidden md:flex items-center" onMouseLeave={() => setHovered(null)}>
            <i
              aria-hidden="true"
              className="absolute top-0 h-full rounded-full bg-secondary transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
              style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
            />
            {links.map((l) => (
              <button
                key={l.id}
                ref={(el) => (refs.current[l.id] = el)}
                onMouseEnter={() => setHovered(l.id)}
                onClick={() => go(l.id)}
                className={`relative z-10 px-3 lg:px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-colors ${
                  active === l.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden h-10 w-10 grid place-items-center"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span className="relative block w-5 h-3">
              <span
                className={`absolute left-0 w-5 h-0.5 bg-foreground transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 w-5 h-0.5 bg-foreground transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>

        {open && (
          <div className="md:hidden flex flex-col px-3 pb-3 animate-fade-up">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-medium ${
                  active === l.id ? "bg-secondary text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
