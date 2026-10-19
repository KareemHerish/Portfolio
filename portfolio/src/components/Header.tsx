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
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Theme state: light by default
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const explicitChoice = localStorage.getItem("portfolio_theme_choice");
      if (explicitChoice === "light" || explicitChoice === "dark") return explicitChoice;
      const legacyTheme = localStorage.getItem("theme");
      if (legacyTheme === "light") return "light";
    }
    return "light";
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
    localStorage.setItem("portfolio_theme_choice", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const checkActiveSection = () => {
      if (isClickScrolling.current) return;

      // Check if user is scrolled to or near bottom of the page
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const isNearBottom = scrollBottom >= docHeight - 140;

      if (isNearBottom) {
        setActive("contact");
        return;
      }

      // If near top of page (hero area)
      if (window.scrollY < 120) {
        setActive(null);
        return;
      }

      // Scan sections in reverse so that currently entered sections take precedence
      const reversed = [...links].reverse();
      const current = reversed.find(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 200 && r.bottom >= 120;
      });

      if (current) {
        setActive(current.id);
      }
    };

    checkActiveSection();
    window.addEventListener("scroll", checkActiveSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkActiveSection);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const target = hovered ?? active;
    const el = target ? refs.current[target] : null;
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    else setPill((p) => ({ ...p, visible: false }));
  }, [hovered, active]);

  const go = (id: string) => {
    setActive(id);
    setOpen(false);
    isClickScrolling.current = true;

    scrollToId(id);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      isClickScrolling.current = false;
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      if (id === "contact" || scrollBottom >= docHeight - 140) {
        setActive("contact");
      }
    }, 950);
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="glass rounded-full w-full max-w-4xl border border-primary/35 ring-1 ring-primary/25 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.1),0_0_25px_-4px_hsl(var(--primary)/0.25)] bg-card/85 backdrop-blur-2xl transition-all">
        <div className="flex items-center justify-between px-3.5 py-2">
          {/* Logo KS and Dark/Light Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go("hero")}
              aria-label="Back to top"
              title="Kareem Salah - Back to top"
              className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/70 shadow-sm transition-transform hover:scale-110 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src="/4f63c602-ef85-419e-a446-c5cb5a5e9639.png"
                alt="Kareem Salah"
                className="h-full w-full object-cover object-center"
              />
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
              className="absolute top-0 h-full rounded-full bg-secondary/90 border border-primary/20 shadow-sm transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
              style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
            />
            {links.map((l) => (
              <button
                key={l.id}
                ref={(el) => (refs.current[l.id] = el)}
                onMouseEnter={() => setHovered(l.id)}
                onClick={() => go(l.id)}
                className={`relative z-10 px-3 lg:px-4 py-1.5 text-xs lg:text-sm rounded-full transition-all duration-200 ${
                  active === l.id
                    ? "text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground font-medium"
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
                className={`text-left px-4 py-3 rounded-2xl text-sm transition-colors ${
                  active === l.id ? "bg-primary/10 text-primary font-bold border border-primary/20" : "text-muted-foreground font-medium"
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
