import React from 'react';

/**
 * StoryFrame — common surface for Storybook examples.
 *
 * Wraps story content in a token-driven surface (background, padding, gap)
 * so individual stories never need to inline raw hex colours or pixel
 * values for the demo chrome.
 */
export interface StoryFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'surface-1' | 'surface-2' | 'surface-3' | 'bg-base';
  caption?: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: 4 | 6 | 8 | 12 | 16 | 24;
  padding?: 8 | 12 | 16 | 24 | 32;
  wrap?: boolean;
}

const SURFACE_BG: Record<NonNullable<StoryFrameProps['surface']>, string> = {
  'surface-1': 'var(--color-surface-1)',
  'surface-2': 'var(--color-surface-2)',
  'surface-3': 'var(--color-surface-3)',
  'bg-base': 'var(--color-bg-base)',
};

export const StoryFrame: React.FC<StoryFrameProps> = ({
  surface = 'surface-1',
  caption,
  direction = 'row',
  gap = 8,
  padding = 16,
  wrap = true,
  children,
  style,
  ...rest
}) => (
  <div
    {...rest}
    style={{
      display: 'flex',
      flexDirection: direction === 'row' ? 'row' : 'column',
      alignItems: direction === 'row' ? 'center' : 'stretch',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: `var(--space-${gap})`,
      padding: `var(--space-${padding})`,
      backgroundColor: SURFACE_BG[surface],
      color: 'var(--color-text-primary)',
      borderRadius: 'var(--radius-medium)',
      ...style,
    }}
  >
    {caption && (
      <span
        style={{
          width: '100%',
          fontFamily: 'Inter, sans-serif',
          fontSize: 'var(--font-size-12)',
          color: 'var(--color-text-muted)',
        }}
      >
        {caption}
      </span>
    )}
    {children}
  </div>
);
