import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Fires once when the target is roughly centered in the viewport.
 * rootMargin shrinks the effective root so the section mid-band must
 * enter the middle of the screen — not merely peek at the edge.
 */
export function useCenteredInViewOnce<T extends Element>(): {
  ref: RefObject<T | null>;
  hasEntered: boolean;
} {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (hasEntered) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      {
        // Require the section to occupy the vertical mid-band.
        threshold: 0.45,
        rootMargin: "-18% 0px -18% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasEntered]);

  return { ref, hasEntered };
}
