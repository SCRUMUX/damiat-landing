import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useParallaxOffset } from '../../hooks/useParallaxOffset';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll-linked shift strength (viewport-centered). */
  factor?: number;
  enabled?: boolean;
  children: React.ReactNode;
}

/**
 * Scroll-linked Y parallax via `--parallax-offset` (GPU-friendly translate3d).
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  factor = 0.08,
  enabled = true,
  className,
  children,
  style,
  ...rest
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = enabled && !prefersReducedMotion && factor !== 0;
  const parallaxRef = useParallaxOffset(factor, active);

  return (
    <div
      ref={parallaxRef as React.RefObject<HTMLDivElement>}
      className={cn(
        active && 'will-change-transform motion-reduce:transform-none',
        className,
      )}
      style={{
        ...style,
        transform: active
          ? 'translate3d(0, var(--parallax-offset, 0), 0)'
          : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

ParallaxLayer.displayName = 'ParallaxLayer';
