import React from 'react';
import { cn } from '../../components/primitives/_shared';
import {
  useScrollDepthReveal,
  type UseScrollDepthRevealOptions,
} from '../../hooks/useScrollDepthReveal';
import './scrollDepthReveal.css';

export type ScrollDepthIntensity = 'subtle' | 'medium' | 'strong';

export interface ScrollDepthRevealProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<UseScrollDepthRevealOptions, 'disabled' | 'rootMargin' | 'threshold'> {
  /** Perspective + 3D enter strength. */
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
  const { ref, revealed } = useScrollDepthReveal<HTMLDivElement>({
    disabled,
    rootMargin,
    threshold,
  });

  const reveal = (
    <Tag
      ref={ref}
      data-scroll-depth={intensity}
      className={cn(
        'scroll-depth-reveal w-full',
        revealed && 'scroll-depth-reveal--revealed',
        staggerChildren && 'scroll-depth-reveal--stagger',
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
    <div className={cn('scroll-depth-stage w-full', className)} {...rest}>
      {reveal}
    </div>
  );
};

ScrollDepthReveal.displayName = 'ScrollDepthReveal';
