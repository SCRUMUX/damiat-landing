/* eslint-disable no-hardcoded-tokens */
/*
 * ScrollBar is @deprecated in v0.5.0 and will be removed in v0.6.0. We
 * intentionally do NOT modernise its hardcoded pixel values — they are frozen
 * for backwards compatibility. New code must use `<ScrollArea>` from
 * `@ai-ds/core/shared`, which is fully token-driven.
 */
import React, { useRef, useCallback, useState } from 'react';
import type { ScrollBarProps, ScrollBarSize, ScrollBarShape, ScrollBarOrientation } from './ScrollBar.types';
import { cn } from '../_shared';

// ─── Deprecation runtime warning ─────────────────────────────────────────────
// AICADS v0.5.0 deprecates the standalone presentational <ScrollBar> in favour
// of the Radix-backed <ScrollArea> (components/primitives/_shared/ScrollArea).
// <ScrollBar> will be removed in v0.6.0. See docs/migrations/v0.4-to-v0.5.md.
let warned = false;
function warnDeprecated() {
  if (warned) return;
  warned = true;
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(
      '[AICADS] <ScrollBar> is deprecated and will be removed in v0.6.0. ' +
        'Use <ScrollArea> from @ai-ds/core/shared instead.',
    );
  }
}

// ─── Size config ──────────────────────────────────────────────────────────────
// From Figma:
//   sm: track thickness=4px, thumb size=12px, arrow container=14×14
//   md: track thickness=6px, thumb size=16px, arrow container=14×14
//   lg: track thickness=8px, thumb size=20px, arrow container=14×14
//
// Track radius = thickness/2 (pill)
// Thumb rect: same size as circle but with r=6

interface SizeConfig {
  trackThickness: number; // height (horizontal) or width (vertical)
  thumbSize: number;      // diameter of circle or cross-section of rect thumb
  arrowContainer: number; // arrow icon container px
}

const SIZE_CONFIG: Record<ScrollBarSize, SizeConfig> = {
  sm: { trackThickness: 4,  thumbSize: 12, arrowContainer: 14 },
  md: { trackThickness: 6,  thumbSize: 16, arrowContainer: 14 },
  lg: { trackThickness: 8,  thumbSize: 20, arrowContainer: 14 },
};

// ─── Arrow icons ──────────────────────────────────────────────────────────────
// Small chevron, color=surface-3 (muted). From Figma: Vector 62 approx 4.4×7px
// We render a simple chevron SVG

interface ArrowIconProps {
  direction: 'left' | 'right' | 'up' | 'down';
  size: number;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction, size }) => {
  const rotate = { left: 0, right: 180, up: 90, down: 270 }[direction];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
    >
      {/* Chevron pointing left: a simple < shape */}
      <path
        d="M9 3L5 7L9 11"
        stroke="var(--color-surface-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * @deprecated Use `<ScrollArea>` from `@ai-ds/core/shared` instead. Will be
 * removed in AICADS v0.6.0. See `docs/migrations/v0.4-to-v0.5.md`.
 */
const ScrollBarInner = React.forwardRef<HTMLDivElement, ScrollBarProps>(({
  orientation = 'horizontal',
  size = 'sm',
  shape = 'circle',
  value = 33,
  onChange,
  trackLength = 120,
  showArrows = true,
  className,
  style,
}, ref) => {
  warnDeprecated();
  const { trackThickness, thumbSize, arrowContainer } = SIZE_CONFIG[size];
  const isHorizontal = orientation === 'horizontal';

  // Clamp value 0–100
  const pos = Math.max(0, Math.min(100, value));

  // Track dimensions
  const trackW = isHorizontal ? trackLength : thumbSize;
  const trackH = isHorizontal ? thumbSize : trackLength;

  // Track background bar (centered thin line)
  const trackBgStyle: React.CSSProperties = isHorizontal
    ? {
        position: 'absolute',
        left: 0, right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: trackThickness,
        borderRadius: trackThickness / 2,
        backgroundColor: 'var(--color-surface-3)',
      }
    : {
        position: 'absolute',
        top: 0, bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: trackThickness,
        borderRadius: trackThickness / 2,
        backgroundColor: 'var(--color-surface-3)',
      };

  // Thumb position within track
  // Available travel = trackLength - thumbSize
  const travel = Math.max(0, trackLength - thumbSize);
  const thumbOffset = (pos / 100) * travel;

  const thumbStyle: React.CSSProperties = shape === 'circle'
    ? {
        position: 'absolute',
        width: thumbSize,
        height: thumbSize,
        borderRadius: '50%',
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-strong)',
        boxSizing: 'border-box',
        cursor: 'pointer',
        flexShrink: 0,
        ...(isHorizontal
          ? { left: thumbOffset, top: '50%', transform: 'translateY(-50%)' }
          : { top: thumbOffset, left: '50%', transform: 'translateX(-50%)' }),
      }
    : {
        position: 'absolute',
        borderRadius: 6,
        backgroundColor: 'var(--color-surface-1)',
        border: '1px solid var(--color-border-strong)',
        boxSizing: 'border-box',
        cursor: 'pointer',
        flexShrink: 0,
        ...(isHorizontal
          ? {
              width: Math.round(trackLength * 0.38), // ~38% of track length for rect thumb
              height: thumbSize,
              left: thumbOffset,
              top: '50%',
              transform: 'translateY(-50%)',
            }
          : {
              height: Math.round(trackLength * 0.38),
              width: thumbSize,
              top: thumbOffset,
              left: '50%',
              transform: 'translateX(-50%)',
            }),
      };

  // Root container direction
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: 'center',
    gap: 4,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={cn('select-none', className)}
      style={containerStyle}
      role="scrollbar"
      aria-orientation={orientation}
      aria-valuenow={pos}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Start arrow */}
      {showArrows && (
        <div
          style={{
            width: arrowContainer,
            height: arrowContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <ArrowIcon
            direction={isHorizontal ? 'left' : 'up'}
            size={arrowContainer}
          />
        </div>
      )}

      {/* Track + Thumb */}
      <div
        style={{
          position: 'relative',
          width: trackW,
          height: trackH,
          flexShrink: 0,
        }}
      >
        {/* Track background */}
        <div style={trackBgStyle} aria-hidden="true" />
        {/* Thumb */}
        <div style={thumbStyle} />
      </div>

      {/* End arrow */}
      {showArrows && (
        <div
          style={{
            width: arrowContainer,
            height: arrowContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <ArrowIcon
            direction={isHorizontal ? 'right' : 'down'}
            size={arrowContainer}
          />
        </div>
      )}
    </div>
  );
});

ScrollBarInner.displayName = 'ScrollBar';
export const ScrollBar = React.memo(ScrollBarInner);
