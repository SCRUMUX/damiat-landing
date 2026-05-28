/**
 * Breakpoint Utilities
 * 
 * Utilities for working with responsive breakpoints.
 * 
 * IMPORTANT: Breakpoint values are imported from grid-system (the canonical source
 * derived from Layout.contract.json). Do NOT redeclare breakpoint constants here.
 */

import {
  BREAKPOINTS as GRID_BREAKPOINTS,
  type BreakpointName,
} from '../layout/grid/grid-system';

// =============================================================================
// TYPES (re-exported from canonical source)
// =============================================================================

export type { BreakpointName } from '../layout/grid/grid-system';

export interface Breakpoint {
  name: BreakpointName;
  min: number;
  max: number | null;
}

export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}

// =============================================================================
// CONSTANTS (derived from grid-system — single source of truth)
// =============================================================================

export const BREAKPOINTS: Record<BreakpointName, Breakpoint> = {
  mobile: { name: 'mobile', min: GRID_BREAKPOINTS.mobile.min, max: GRID_BREAKPOINTS.mobile.max },
  tablet: { name: 'tablet', min: GRID_BREAKPOINTS.tablet.min, max: GRID_BREAKPOINTS.tablet.max },
  desktop: { name: 'desktop', min: GRID_BREAKPOINTS.desktop.min, max: GRID_BREAKPOINTS.desktop.max },
};

export const BREAKPOINT_ORDER: BreakpointName[] = ['mobile', 'tablet', 'desktop'];

// =============================================================================
// BREAKPOINT DETECTION
// =============================================================================

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): BreakpointName {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.desktop.min) return 'desktop';
  if (width >= BREAKPOINTS.tablet.min) return 'tablet';
  return 'mobile';
}

/**
 * Check if current viewport matches a breakpoint
 */
export function matchesBreakpoint(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const bp = BREAKPOINTS[breakpoint];
  
  const matchesMin = width >= bp.min;
  const matchesMax = bp.max === null || width <= bp.max;
  
  return matchesMin && matchesMax;
}

/**
 * Check if current viewport is at least a certain breakpoint
 */
export function isAtLeast(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  return width >= BREAKPOINTS[breakpoint].min;
}

/**
 * Check if current viewport is at most a certain breakpoint
 */
export function isAtMost(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const max = BREAKPOINTS[breakpoint].max;
  
  return max === null ? true : width <= max;
}

// =============================================================================
// RESPONSIVE VALUE RESOLUTION
// =============================================================================

/**
 * Resolve a responsive value for the current breakpoint
 * Uses mobile-first approach: falls back to smaller breakpoints if not defined
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T> | T,
  breakpoint?: BreakpointName
): T | undefined {
  // Non-responsive value
  if (!isResponsiveValue(value)) {
    return value as T;
  }
  
  const bp = breakpoint ?? getCurrentBreakpoint();
  const responsiveValue = value as ResponsiveValue<T>;
  
  // Mobile-first: try current breakpoint, then fall back to smaller ones
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  
  for (let i = bpIndex; i >= 0; i--) {
    const checkBp = BREAKPOINT_ORDER[i];
    if (responsiveValue[checkBp] !== undefined) {
      return responsiveValue[checkBp];
    }
  }
  
  return undefined;
}

/**
 * Check if a value is responsive (has breakpoint keys)
 */
export function isResponsiveValue<T>(value: ResponsiveValue<T> | T): value is ResponsiveValue<T> {
  if (typeof value !== 'object' || value === null) return false;
  
  const keys = Object.keys(value);
  return keys.some(k => BREAKPOINT_ORDER.includes(k as BreakpointName));
}

// =============================================================================
// MEDIA QUERY GENERATION
// =============================================================================

/**
 * Get media query string for a breakpoint
 */
export function getMediaQuery(breakpoint: BreakpointName): string {
  const bp = BREAKPOINTS[breakpoint];
  
  if (bp.max === null) {
    return `(min-width: ${bp.min}px)`;
  }
  
  return `(min-width: ${bp.min}px) and (max-width: ${bp.max}px)`;
}

/**
 * Get min-width media query for mobile-first approach
 */
export function getMinWidthQuery(breakpoint: BreakpointName): string {
  return `(min-width: ${BREAKPOINTS[breakpoint].min}px)`;
}

/**
 * Generate CSS with media queries for responsive values
 */
export function generateResponsiveCSS<T>(
  property: string,
  value: ResponsiveValue<T>,
  valueTransform?: (v: T) => string
): string {
  const lines: string[] = [];
  const transform = valueTransform ?? (v => String(v));
  
  // Mobile (default, no media query)
  if (value.mobile !== undefined) {
    lines.push(`${property}: ${transform(value.mobile)};`);
  }
  
  // Tablet
  if (value.tablet !== undefined) {
    lines.push(`@media ${getMinWidthQuery('tablet')} {`);
    lines.push(`  ${property}: ${transform(value.tablet)};`);
    lines.push(`}`);
  }
  
  // Desktop
  if (value.desktop !== undefined) {
    lines.push(`@media ${getMinWidthQuery('desktop')} {`);
    lines.push(`  ${property}: ${transform(value.desktop)};`);
    lines.push(`}`);
  }
  
  return lines.join('\n');
}

// =============================================================================
// HOOKS SUPPORT (for React)
// =============================================================================

/**
 * Create a breakpoint listener
 * Returns cleanup function
 */
export function onBreakpointChange(
  callback: (breakpoint: BreakpointName) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  let currentBp = getCurrentBreakpoint();
  
  const handler = () => {
    const newBp = getCurrentBreakpoint();
    if (newBp !== currentBp) {
      currentBp = newBp;
      callback(newBp);
    }
  };
  
  window.addEventListener('resize', handler);
  
  return () => window.removeEventListener('resize', handler);
}

// =============================================================================
// TAILWIND CLASS GENERATION
// =============================================================================

/**
 * Generate Tailwind classes for responsive values
 */
export function responsiveClasses<T>(
  prefix: string,
  value: ResponsiveValue<T> | T,
  valueTransform?: (v: T) => string
): string {
  if (!isResponsiveValue(value)) {
    const transform = valueTransform ?? (v => String(v));
    return `${prefix}-${transform(value as T)}`;
  }
  
  const classes: string[] = [];
  const transform = valueTransform ?? (v => String(v));
  
  if (value.mobile !== undefined) {
    classes.push(`${prefix}-${transform(value.mobile)}`);
  }
  if (value.tablet !== undefined) {
    classes.push(`tablet:${prefix}-${transform(value.tablet)}`);
  }
  if (value.desktop !== undefined) {
    classes.push(`desktop:${prefix}-${transform(value.desktop)}`);
  }
  
  return classes.join(' ');
}
