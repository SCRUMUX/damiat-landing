import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useLoopSeamScroll } from '../../hooks/useLoopSeamScroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { LoopSeamChamber } from './LoopSeamChamber';
import './scrollLoopSeam.css';

export interface LoopSeamProps {
  enabled?: boolean;
  imageSrc: string;
  imageAlt?: string;
  phrases: readonly string[];
  className?: string;
}

/**
 * Scroll runway between footer and clone-hero — fixed bg + gate transforms on real sections.
 */
export const LoopSeam: React.FC<LoopSeamProps> = ({
  enabled = true,
  imageSrc,
  imageAlt = 'DAMIAT',
  phrases,
  className,
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = enabled && !prefersReducedMotion;
  const { ref, activeIndex } = useLoopSeamScroll(phrases, active);

  if (!active) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-loop-seam
      data-scroll-loop-bridge
      className={cn('loop-seam', className)}
      aria-label="DAMIAT"
    >
      <LoopSeamChamber
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        phrases={phrases}
        activeIndex={activeIndex}
      />
      <div className="loop-seam__runway" data-loop-seam-runway aria-hidden="true" />
    </div>
  );
};

LoopSeam.displayName = 'LoopSeam';
