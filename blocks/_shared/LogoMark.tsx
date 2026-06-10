import React from 'react';
import { cn } from '../../components/primitives/_shared';

export interface LogoMarkProps {
  /** Company or product name (text fallback when no image). */
  name: string;
  /** Optional logo image or SVG node. */
  logo?: React.ReactNode;
  className?: string;
}

/** Single logo cell for LogoCloudBlock — fixed height tile, not floating uppercase text. */
export const LogoMark: React.FC<LogoMarkProps> = ({ name, logo, className }) => (
  <div
    className={cn(
      'flex h-[var(--space-48)] w-full min-w-0 items-center justify-center',
      'rounded-[var(--radius-default)] border border-[var(--color-border-base)]',
      'bg-[var(--color-bg-base)] px-[var(--space-inset-l)]',
      className,
    )}
  >
    {logo ?? (
      <span className="truncate text-style-body-sm font-medium text-[var(--color-text-muted)]">
        {name}
      </span>
    )}
  </div>
);

LogoMark.displayName = 'LogoMark';
