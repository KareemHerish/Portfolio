import { useEffect, useRef } from "react";

/** Full-screen responsive neural network / particle canvas that reacts to cursor and theme */
const BackgroundCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "168 82% 52%";
    let isLight = document.documentElement.classList.contains("light");

    const updateThemeVars = () => {
      primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "168 82% 52%";
      isLight = document.documentElement.classList.contains("light");
    };

    const observer = new MutationObserver(() => {
      updateThemeVars();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let w = 0, h = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(95, (w * h) / 15000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Contrast factors for light vs dark mode
      const lineAlphaFactor = isLight ? 0.46 : 0.24;
      const mouseAlphaFactor = isLight ? 0.78 : 0.48;
      const dotAlpha = isLight ? 0.95 : 0.75;
      const dotRadius = isLight ? 2.2 : 1.7;
      const lineWidth = isLight ? 1.25 : 1.0;

      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 150 && d > 0) {
          p.x += (dx / d) * 0.85;
          p.y += (dy / d) * 0.85;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 135) {
            ctx.strokeStyle = `hsl(${primary} / ${(1 - d / 135) * lineAlphaFactor})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 190) {
          ctx.strokeStyle = `hsl(${primary} / ${(1 - md / 190) * mouseAlphaFactor})`;
          ctx.lineWidth = isLight ? 1.45 : 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = `hsl(${primary} / ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default BackgroundCanvas;
