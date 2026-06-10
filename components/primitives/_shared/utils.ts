/**
 * Shared utilities for all primitive components.
 * Single source of truth — import from this file instead of duplicating in each component.
 */

import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export type VR = { when: Record<string, string>; tailwindClasses: string[] };

/** AICADS typography utilities must not conflict with semantic `text-[var(--color-*)]` classes. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'aicads-text-style': [
        {
          'text-style': [
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'body-lg',
            'body',
            'body-strong',
            'body-sm',
            'body-xs',
            'caption',
            'caption-xs',
            'mono',
          ],
        },
      ],
    } as Record<string, readonly (string | { readonly [key: string]: readonly string[] })[]>,
  },
});

/** Returns all tailwindClasses from rules where all `when` fields match `args`. */
export function findClasses(rules: VR[], args: Record<string, string>): string[] {
  return rules
    .filter((r) => {
      for (const k of Object.keys(r.when)) {
        if (r.when[k] !== args[k]) return false;
      }
      return true;
    })
    .flatMap((r) => r.tailwindClasses);
}

/**
 * Combines class names with proper Tailwind conflict resolution.
 *
 * Uses `clsx` to flatten conditionals/arrays/objects, then `tailwind-merge`
 * to deduplicate conflicting Tailwind utilities so that the **last** class
 * wins — including arbitrary values like `px-[var(--space-12)]`.
 *
 * This is the foundation that lets consumer `className` always override
 * internal defaults without needing `!important`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes contract focus-ring classes so the visible ring is exactly 1px.
 * Contracts declare focus-visible shadow utilities; border is made transparent
 * on focus so 1px border + 1px shadow cannot stack into a 2px ring.
 */
function normalizeFocusRing(ring: string): string {
  if (!ring) return '';
  if (!ring.includes('shadow-focus')) return ring;
  return cn(ring, 'focus-visible:border-transparent');
}

/** Determines the correct focus ring class based on appearance. */
export function getFocusRing(
  contract: Record<string, unknown>,
  appearance?: string,
): string {
  let ring = (contract.focusRing as string) ?? '';

  if (appearance?.includes('danger')) {
    ring = (contract.focusRingDanger as string) ?? ring;
  } else if (appearance?.includes('success')) {
    ring = (contract.focusRingSuccess as string) ?? ring;
  } else if (appearance?.includes('warning')) {
    ring = (contract.focusRingWarning as string) ?? ring;
  }

  return normalizeFocusRing(ring);
}
