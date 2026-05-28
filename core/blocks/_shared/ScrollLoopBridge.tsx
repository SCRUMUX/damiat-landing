import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useBridgePhraseScroll } from '../../hooks/useBridgePhraseScroll';
import { FilmGrainOverlay } from './FilmGrainOverlay';
import './scrollLoopBridge.css';

export interface ScrollLoopBridgeProps {
  wordmark?: string;
  phrases: readonly string[];
  className?: string;
}

/**
 * Full-viewport gray grain interstitial between loop footer and the next hero.
 */
export const ScrollLoopBridge: React.FC<ScrollLoopBridgeProps> = ({
  wordmark = 'DAMIAT',
  phrases,
  className,
}) => {
  const { ref, activeIndex } = useBridgePhraseScroll<HTMLElement>(phrases);

  return (
    <section
      ref={ref}
      data-scroll-loop-bridge
      className={cn('scroll-loop-bridge flex w-full flex-col items-center justify-center', className)}
      aria-label="DAMIAT"
    >
      <div className="scroll-loop-bridge__base" aria-hidden="true" />
      <div className="scroll-loop-bridge__noise" aria-hidden="true" />
      <div className="scroll-loop-bridge__veil-top" aria-hidden="true" />
      <div className="scroll-loop-bridge__veil-bottom" aria-hidden="true" />
      <FilmGrainOverlay intensity="strong" className="opacity-[0.32]" />

      <div
        className="relative z-[1] flex w-full max-w-[var(--space-640)] flex-col items-center px-[var(--grid-margin)] text-center"
        style={{ gap: 'var(--space-section-content-l)' }}
      >
        <p className="scroll-loop-bridge__wordmark" aria-hidden="true">
          {wordmark}
        </p>

        <div
          className="relative min-h-[var(--space-72)] w-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {phrases.map((phrase, index) => (
            <p
              key={phrase}
              className={cn(
                'scroll-loop-bridge__phrase absolute inset-x-0 top-0 m-0 text-style-h3 font-medium text-[var(--color-text-primary)]',
                index === activeIndex
                  ? 'scroll-loop-bridge__phrase--active'
                  : 'scroll-loop-bridge__phrase--idle',
              )}
            >
              {phrase}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

ScrollLoopBridge.displayName = 'ScrollLoopBridge';
