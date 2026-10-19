import { useEffect, useRef } from "react";

/** Ultra-optimized responsive neural network canvas */
const BackgroundCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "168 82% 52%";
    let isLight = document.documentElement.classList.contains("light");

    const updateThemeVars = () => {
      primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "168 82% 52%";
      isLight = document.documentElement.classList.contains("light");
    };

    const observer = new MutationObserver(updateThemeVars);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let w = 0, h = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];
    let isPaused = false;
    let isScrolling = false;
    let scrollTimeout = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 36 particles max for fluid 120fps performance
      const count = Math.round(Math.min(36, (w * h) / 45000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      if (isPaused || document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const lineAlpha = isLight ? 0.30 : 0.16;
      const dotAlpha = isLight ? 0.85 : 0.65;
      const dotRadius = isLight ? 1.8 : 1.5;
      const maxDist = 110;
      const maxDistSq = maxDist * maxDist;

      // Update positions
      const hasMouse = mouse.x > 0 && !isScrolling;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (hasMouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 0) { // < 120px
            const d = Math.sqrt(distSq);
            p.x += (dx / d) * 0.6;
            p.y += (dy / d) * 0.6;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // 1. Batch draw connections (skip during fast scroll for max FPS)
      if (!isScrolling) {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${primary} / ${lineAlpha})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
            if (dx * dx + dy * dy < maxDistSq) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
          if (hasMouse) {
            const mdx = a.x - mouse.x;
            const mdy = a.y - mouse.y;
            if (Math.abs(mdx) < 130 && Math.abs(mdy) < 130 && (mdx * mdx + mdy * mdy < 16900)) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(mouse.x, mouse.y);
            }
          }
        }
        ctx.stroke();
      }

      // 2. Batch draw dots
      ctx.beginPath();
      ctx.fillStyle = `hsl(${primary} / ${dotAlpha})`;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.moveTo(p.x + dotRadius, p.y);
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
      }
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleVisibility = () => {
      isPaused = document.hidden;
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 70);
    };

    resize();
    draw();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimeout);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none transform-gpu"
    />
  );
};

export default BackgroundCanvas;
