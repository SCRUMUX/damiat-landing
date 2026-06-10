import React, { useEffect, useRef, useState } from 'react';
import './marquee-keyframes.css';
import { cn } from '../../components/primitives/_shared';

/** Visual scroll direction — how logos move across the viewport. */
export type MarqueeDirection = 'to-left' | 'to-right';

export interface MarqueeRowProps {
  /** `to-right` — left → right; `to-left` — right → left (Cortel partners band). */
  direction?: MarqueeDirection;
  /** Scroll speed in pixels per second (Cortel default: 80). */
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

const MARQUEE_KEYFRAMES: Record<MarqueeDirection, string> = {
  'to-left': 'partners-marquee-to-left',
  'to-right': 'partners-marquee-to-right',
};

function cloneMarqueeChildren(children: React.ReactNode, suffix: string) {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    const key = child.key != null ? `${String(child.key)}${suffix}` : `${suffix}-${index}`;
    return React.cloneElement(child, { key });
  });
}

function useMarqueeDuration(
  trackRef: React.RefObject<HTMLDivElement | null>,
  speed: number,
  childCount: number,
) {
  const [durationSec, setDurationSec] = useState(30);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const update = () => {
      const loopWidth = track.scrollWidth / 2;
      setDurationSec(Math.max(loopWidth / speed, 10));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [speed, trackRef, childCount]);

  return durationSec;
}

/**
 * Infinite horizontal marquee — duplicates children for a seamless loop.
 * Keyframes are registered globally via Tailwind `addBase` (always in bundle).
 */
export const MarqueeRow: React.FC<MarqueeRowProps> = ({
  direction = 'to-left',
  speed = 80,
  className,
  children,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const childCount = React.Children.count(children);
  const durationSec = useMarqueeDuration(trackRef, speed, childCount);

  const primary = cloneMarqueeChildren(children, '-a');
  const duplicate = cloneMarqueeChildren(children, '-b');

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        ref={trackRef}
        className="aicads-marquee-track flex w-max min-w-0 will-change-transform"
        style={{
          animationName: MARQUEE_KEYFRAMES[direction],
          animationDuration: `${durationSec}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        <div className="flex shrink-0 items-center gap-[var(--space-2)]">{primary}</div>
        <div className="flex shrink-0 items-center gap-[var(--space-2)]" aria-hidden="true">
          {duplicate}
        </div>
      </div>
    </div>
  );
};

MarqueeRow.displayName = 'MarqueeRow';
