import { useEffect, useRef } from "react";

/** Adds the `in` class to every `.reveal` element inside the container when it scrolls into view. */
export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
};

/** Mouse-follow spotlight: sets --mx/--my on the hovered element. */
export const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === "contact") {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const maxScroll = Math.max(0, docHeight - window.innerHeight);
    const targetTop = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({
      top: Math.max(targetTop, maxScroll),
      behavior: "smooth",
    });
    return;
  }
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 90,
    behavior: "smooth",
  });
};

