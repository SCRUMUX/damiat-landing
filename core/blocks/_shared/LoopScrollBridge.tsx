import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useScrollLoopContext } from '../../hooks/ScrollLoopContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FilmGrainOverlay } from './FilmGrainOverlay';
import './scrollLoopBridge.css';

export interface LoopScrollBridgeProps {
  enabled?: boolean;
  imageSrc: string;
  imageAlt?: string;
  phrases: readonly string[];
  className?: string;
}

/**
 * Full-viewport bridge in document flow — image + slogan between footer and loop clone hero.
 * No fixed chamber or gate transforms (smooth scroll).
 */
export const LoopScrollBridge: React.FC<LoopScrollBridgeProps> = ({
  enabled = true,
  imageSrc,
  imageAlt = 'DAMIAT',
  phrases,
  className,
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { loopEpoch } = useScrollLoopContext();
  const active = enabled && !prefersReducedMotion && phrases.length > 0;

  if (!active) {
    return null;
  }

  const phrase = phrases[loopEpoch % phrases.length] ?? phrases[0];

  return (
    <section
      data-scroll-loop-bridge
      className={cn('loop-scroll-bridge', className)}
      aria-label={imageAlt}
    >
      <div className="loop-scroll-bridge__inner">
        <div className="loop-scroll-bridge__stage">
          <div className="loop-scroll-bridge__image-wrap">
            <img
              src={imageSrc}
              alt=""
              className="loop-scroll-bridge__image"
              decoding="async"
              draggable={false}
              aria-hidden="true"
            />
            <FilmGrainOverlay
              intensity="medium"
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
            />
          </div>
          <p
            className="loop-scroll-bridge__phrase font-semibold text-[var(--color-text-primary)]"
            aria-live="polite"
          >
            {phrase}
          </p>
        </div>
      </div>
    </section>
  );
};

LoopScrollBridge.displayName = 'LoopScrollBridge';
