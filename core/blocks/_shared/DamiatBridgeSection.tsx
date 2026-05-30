import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FilmGrainOverlay } from './FilmGrainOverlay';
import './scrollLoopBridge.css';

export interface DamiatBridgeSectionProps {
  enabled?: boolean;
  imageSrc: string;
  imageAlt?: string;
  phrase?: string;
  /** Film grain overlay on bridge image — default true. */
  grain?: boolean;
  className?: string;
}

/**
 * In-flow DAMIAT bridge — centered image + slogan (no scroll loop).
 */
export const DamiatBridgeSection: React.FC<DamiatBridgeSectionProps> = ({
  enabled = true,
  imageSrc,
  imageAlt = 'DAMIAT',
  phrase,
  grain = true,
  className,
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (!enabled || prefersReducedMotion || !phrase) {
    return null;
  }

  return (
    <section
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
              loading="lazy"
              draggable={false}
              aria-hidden="true"
            />
            {grain ? (
              <FilmGrainOverlay
                intensity="medium"
                className="pointer-events-none absolute inset-0 opacity-[0.16]"
              />
            ) : null}
          </div>
          <p className="loop-scroll-bridge__phrase font-semibold text-[var(--color-text-primary)]">
            {phrase}
          </p>
        </div>
      </div>
    </section>
  );
};

DamiatBridgeSection.displayName = 'DamiatBridgeSection';
