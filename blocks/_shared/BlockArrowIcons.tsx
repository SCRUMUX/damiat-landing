import React from 'react';
import { cn } from '../../components/primitives/_shared';

/** Rotate ↗ arrow on parent `group` hover — pair with BLOCK_CHROME_ROUND_ARROW_* classes. */
export const BLOCK_ARROW_ICON_HOVER_CLASS =
  'transition-transform duration-200 ease-out group-hover:rotate-45';

/** Straight diagonal ↗ arrow (not L-shaped) — shared marketing chrome. */
export function BlockArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('shrink-0', BLOCK_ARROW_ICON_HOVER_CLASS, className)}
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H10M17 7V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

BlockArrowUpRightIcon.displayName = 'BlockArrowUpRightIcon';
