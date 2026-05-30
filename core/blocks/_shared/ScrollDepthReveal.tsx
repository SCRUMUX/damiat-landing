import React from 'react';
import { cn } from '../../components/primitives/_shared';
import {
  useScrollDepthReveal,
  type UseScrollDepthRevealOptions,
} from '../../hooks/useScrollDepthReveal';
import './scrollDepthReveal.css';

export type ScrollDepthIntensity = 'subtle' | 'medium' | 'strong';

/** `depth` — 3D perspective reveal; `fade` — opacity + translateY only. */
export type ScrollDepthVariant = 'depth' | 'fade';

export interface ScrollDepthRevealProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<UseScrollDepthRevealOptions, 'disabled' | 'rootMargin' | 'threshold'> {
  /** `depth` (default) or lightweight `fade` for long landing pages. */
  variant?: ScrollDepthVariant;
  /** Perspective + 3D enter strength (depth variant only). */
  intensity?: ScrollDepthIntensity;
  /** Animate direct children with incremental delay. */
  staggerChildren?: boolean;
  /** Apply perspective wrapper (disable when nested inside another stage). */
  stage?: boolean;
  as?: 'div' | 'section';
  children: React.ReactNode;
}

/**
 * One-shot fake-3D section reveal on scroll (CSS perspective + translateZ / rotateX).
 */
export const ScrollDepthReveal: React.FC<ScrollDepthRevealProps> = ({
  variant = 'depth',
  intensity = 'medium',
  staggerChildren = false,
  stage = true,
  disabled = false,
  rootMargin,
  threshold,
  as: Tag = 'div',
  className,
  children,
  ...rest
}) => {
  const fade = variant === 'fade';
  const { ref, revealed } = useScrollDepthReveal<HTMLDivElement>({
    disabled,
    rootMargin,
    threshold,
  });

  const reveal = (
    <Tag
      ref={ref}
      data-scroll-depth={fade ? undefined : intensity}
      className={cn(
        'scroll-depth-reveal w-full',
        fade && 'scroll-depth-reveal--fade',
        revealed && 'scroll-depth-reveal--revealed',
        !fade && staggerChildren && 'scroll-depth-reveal--stagger',
        !stage && className,
      )}
      {...(stage ? {} : rest)}
    >
      {children}
    </Tag>
  );

  if (!stage) {
    return reveal;
  }

  return (
    <div
      className={cn(
        'scroll-depth-stage w-full',
        fade && 'scroll-depth-stage--fade',
        className,
      )}
      {...rest}
    >
      {reveal}
    </div>
  );
};

ScrollDepthReveal.displayName = 'ScrollDepthReveal';
