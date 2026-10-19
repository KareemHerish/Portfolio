import { useEffect, useRef, useState, useLayoutEffect } from "react";
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

interface TabPos {
  x: number;
  width: number;
}

interface SectionBounds {
  id: string;
  top: number;
  bottom: number;
}

const Header = () => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabPositions = useRef<Record<string, TabPos>>({});
  const sectionBounds = useRef<SectionBounds[]>([]);
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

  // Measure tab button geometries once (and on resize)
  const measureTabs = () => {
    links.forEach(({ id }) => {
      const el = refs.current[id];
      if (el) {
        tabPositions.current[id] = {
          x: el.offsetLeft,
          width: el.offsetWidth,
        };
      }
    });
  };

  // Measure section positions once (and on resize)
  const measureSections = () => {
    sectionBounds.current = links
      .map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return {
          id,
          top,
          bottom: top + el.offsetHeight,
        };
      })
      .filter(Boolean) as SectionBounds[];
  };

  useLayoutEffect(() => {
    measureTabs();
    measureSections();
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      if (isClickScrolling.current) return;

      const y = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const isNearBottom = y + window.innerHeight >= docHeight - 120;

      if (isNearBottom) {
        setActive((prev) => (prev !== "contact" ? "contact" : prev));
        return;
      }

      if (y < 120) {
        setActive((prev) => (prev !== null ? null : prev));
        return;
      }

      // Check against cached section numbers in memory — ZERO DOM layout queries!
      const bounds = sectionBounds.current;
      for (let i = bounds.length - 1; i >= 0; i--) {
        const s = bounds[i];
        if (y >= s.top - 200 && y < s.bottom - 100) {
          setActive((prev) => (prev !== s.id ? s.id : prev));
          return;
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      measureTabs();
      measureSections();
      updateActiveSection();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Initial check
    setTimeout(() => {
      measureTabs();
      measureSections();
      updateActiveSection();
    }, 100);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const go = (id: string) => {
    setActive(id);
    setOpen(false);
    isClickScrolling.current = true;

    scrollToId(id);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      isClickScrolling.current = false;
      const y = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      if (id === "contact" || y + window.innerHeight >= docHeight - 120) {
        setActive("contact");
      }
    }, 550);
  };

  // Immediate GPU transform calculation without double-rendering
  const targetId = hovered ?? active;
  const currentTab = targetId ? tabPositions.current[targetId] : null;

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 transform-gpu">
      <div className="glass rounded-full w-full max-w-4xl border border-primary/35 ring-1 ring-primary/25 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.1),0_0_25px_-4px_hsl(var(--primary)/0.25)] bg-card/90 backdrop-blur-md transition-all">
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

          {/* Desktop Nav Items */}
          <div className="relative hidden md:flex items-center" onMouseLeave={() => setHovered(null)}>
            {/* GPU Accelerated Smooth Sliding Pill */}
            <i
              aria-hidden="true"
              className="absolute top-0 left-0 h-full rounded-full bg-secondary/90 border border-primary/20 shadow-xs pointer-events-none transition-transform duration-150 ease-out will-change-transform"
              style={{
                transform: currentTab ? `translate3d(${currentTab.x}px, 0, 0)` : "translate3d(0, 0, 0)",
                width: currentTab ? `${currentTab.width}px` : 0,
                opacity: currentTab ? 1 : 0,
              }}
            />
            {links.map((l) => (
              <button
                key={l.id}
                ref={(el) => (refs.current[l.id] = el)}
                onMouseEnter={() => setHovered(l.id)}
                onClick={() => go(l.id)}
                className={`relative z-10 px-3 lg:px-4 py-1.5 text-xs lg:text-sm rounded-full transition-colors duration-150 ${
                  active === l.id
                    ? "text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Dropdown */}
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
