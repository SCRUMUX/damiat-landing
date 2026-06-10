import { useEffect, useState } from 'react';

export interface UseScrollSpyOptions {
  rootMargin?: string;
  /** When true, pick the last section whose top passed the spy line (scroll-up friendly). */
  preferTopmost?: boolean;
}

/**
 * Track which section id is active while scrolling — for case-study anchor nav.
 */
export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {},
): string {
  const { rootMargin = '-40% 0px -45% 0px', preferTopmost = true } = options;
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length === 0) return;

        const next = preferTopmost
          ? intersecting.sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            )[0]
          : intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const id = next?.target.id;
        if (id) setActiveId(id);
      },
      { rootMargin, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [preferTopmost, rootMargin, sectionIds.join('|')]);

  return activeId;
}
