import React, { useEffect, useRef } from 'react';
import { cn } from '../../components/primitives/_shared';
import { ScrollLoopProvider, useScrollLoopContext } from '../../hooks/ScrollLoopContext';
import { useScrollLoop } from '../../hooks/useScrollLoop';
import { getScrollRoot } from '../../hooks/useScrollRoot';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './scrollLoopShell.css';

export interface ScrollLoopShellProps {
  enabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function ScrollLoopSegments({
  enabled,
  className,
  children,
}: ScrollLoopShellProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = enabled && !prefersReducedMotion;
  const { notifyLoopWrap } = useScrollLoopContext();
  const liveRef = useScrollLoop<HTMLDivElement>({
    enabled: active,
    onWrap: notifyLoopWrap,
  });
  const cloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!active) {
      html.removeAttribute('data-scroll-loop');
      return;
    }
    html.setAttribute('data-scroll-loop', 'active');
    const scrollRoot = getScrollRoot();
    if (scrollRoot instanceof HTMLElement && scrollRoot !== html) {
      scrollRoot.setAttribute('data-scroll-loop', 'active');
    }
    return () => {
      html.removeAttribute('data-scroll-loop');
      if (scrollRoot instanceof HTMLElement) {
        scrollRoot.removeAttribute('data-scroll-loop');
      }
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const clone = cloneRef.current;
    if (!clone) return;
    clone.setAttribute('inert', '');
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  }, [active, children]);

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('scroll-loop-shell', className)}>
      <div ref={liveRef} data-scroll-loop-segment="live">
        {children}
      </div>
      <div
        ref={cloneRef}
        data-scroll-loop-segment="clone"
        aria-hidden="true"
        className="pointer-events-none select-none"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Duplicates landing scroll body for seamless vertical loop (Corn-style).
 * Clone segment is inert; ids stripped after mount.
 */
export const ScrollLoopShell: React.FC<ScrollLoopShellProps> = ({
  enabled = true,
  className,
  children,
}) => (
  <ScrollLoopProvider enabled={enabled}>
    <ScrollLoopSegments enabled={enabled} className={className}>
      {children}
    </ScrollLoopSegments>
  </ScrollLoopProvider>
);

ScrollLoopShell.displayName = 'ScrollLoopShell';
