/**
 * Grid System Foundation
 * 
 * Token-driven grid system abstractions for machine-readable layout generation.
 * This module provides the foundation for automated layout creation.
 * 
 * From: Layout.contract.json
 */

// =============================================================================
// TYPES
// =============================================================================

export type BreakpointName = 'mobile' | 'tablet' | 'desktop';

export interface GridConfig {
  columns: number;
  gutter: string;
  offset: string;
  sectionSize: string;
}

export interface GridSpan {
  start: number;
  end: number;
}

export interface ResponsiveGridSpan {
  mobile?: GridSpan | number;
  tablet?: GridSpan | number;
  desktop?: GridSpan | number;
}

// =============================================================================
// CONSTANTS (derived from Layout.contract.json)
// =============================================================================

export const BREAKPOINTS = {
  mobile: { min: 320, max: 767 },
  tablet: { min: 768, max: 1439 },
  desktop: { min: 1440, max: null },
} as const;

export const GRID_CONFIGS: Record<BreakpointName, GridConfig> = {
  mobile: {
    columns: 4,
    gutter: 'var(--grid-mobile-gutter)',
    offset: 'var(--grid-mobile-offset)',
    sectionSize: 'var(--grid-mobile-section-size)',
  },
  tablet: {
    columns: 8,
    gutter: 'var(--grid-tablet-gutter)',
    offset: 'var(--grid-tablet-offset)',
    sectionSize: 'var(--grid-tablet-section-size)',
  },
  desktop: {
    columns: 12,
    gutter: 'var(--grid-desktop-gutter)',
    offset: 'var(--grid-desktop-offset)',
    sectionSize: 'var(--grid-desktop-section-size)',
  },
};

// =============================================================================
// GRID UTILITIES
// =============================================================================

/**
 * Get the current breakpoint based on window width
 */
export function getCurrentBreakpoint(width: number): BreakpointName {
  if (width >= BREAKPOINTS.desktop.min) return 'desktop';
  if (width >= BREAKPOINTS.tablet.min) return 'tablet';
  return 'mobile';
}

/**
 * Get grid configuration for a breakpoint
 */
export function getGridConfig(breakpoint: BreakpointName): GridConfig {
  return GRID_CONFIGS[breakpoint];
}

/**
 * Get maximum columns for a breakpoint
 */
export function getMaxColumns(breakpoint: BreakpointName): number {
  return GRID_CONFIGS[breakpoint].columns;
}

/**
 * Validate grid span against breakpoint constraints
 */
export function validateGridSpan(
  span: GridSpan | number,
  breakpoint: BreakpointName
): { valid: boolean; error?: string } {
  const maxCols = getMaxColumns(breakpoint);
  
  if (typeof span === 'number') {
    if (span < 1 || span > maxCols) {
      return {
        valid: false,
        error: `Span ${span} is invalid for ${breakpoint} (max: ${maxCols})`,
      };
    }
    return { valid: true };
  }
  
  if (span.start < 1 || span.start > maxCols) {
    return {
      valid: false,
      error: `Start position ${span.start} is invalid for ${breakpoint} (max: ${maxCols})`,
    };
  }
  
  if (span.end < span.start || span.end > maxCols + 1) {
    return {
      valid: false,
      error: `End position ${span.end} is invalid for ${breakpoint}`,
    };
  }
  
  return { valid: true };
}

/**
 * Normalize span to GridSpan object
 */
export function normalizeSpan(
  span: GridSpan | number,
  breakpoint: BreakpointName
): GridSpan {
  if (typeof span === 'number') {
    return { start: 1, end: span + 1 };
  }
  return span;
}

// =============================================================================
// CSS GENERATION
// =============================================================================

/**
 * Generate CSS grid-column value from span
 */
export function spanToCSS(span: GridSpan | number): string {
  if (typeof span === 'number') {
    return `span ${span}`;
  }
  return `${span.start} / ${span.end}`;
}

/**
 * Generate responsive grid column CSS
 */
export function generateResponsiveGridCSS(spans: ResponsiveGridSpan): Record<string, string> {
  const styles: Record<string, string> = {};
  
  if (spans.mobile !== undefined) {
    styles['gridColumn'] = spanToCSS(spans.mobile);
  }
  
  // For responsive overrides, use CSS custom properties approach
  // This allows runtime updates without regenerating CSS
  
  return styles;
}

/**
 * Generate grid container CSS for a breakpoint
 */
export function generateGridContainerCSS(breakpoint: BreakpointName): Record<string, string> {
  const config = GRID_CONFIGS[breakpoint];
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
    gap: config.gutter,
    paddingLeft: config.offset,
    paddingRight: config.offset,
  };
}

/**
 * Generate full responsive grid container CSS
 */
export function generateResponsiveGridContainerCSS(): string {
  return `
.grid-container {
  display: grid;
  width: 100%;
}

/* Mobile (default) */
.grid-container {
  grid-template-columns: repeat(var(--grid-mobile-columns, 4), 1fr);
  gap: var(--grid-mobile-gutter);
  padding-left: var(--grid-mobile-offset);
  padding-right: var(--grid-mobile-offset);
}

/* Tablet */
@media (min-width: ${BREAKPOINTS.tablet.min}px) {
  .grid-container {
    grid-template-columns: repeat(var(--grid-tablet-columns, 8), 1fr);
    gap: var(--grid-tablet-gutter);
    padding-left: var(--grid-tablet-offset);
    padding-right: var(--grid-tablet-offset);
  }
}

/* Desktop */
@media (min-width: ${BREAKPOINTS.desktop.min}px) {
  .grid-container {
    grid-template-columns: repeat(var(--grid-desktop-columns, 12), 1fr);
    gap: var(--grid-desktop-gutter);
    padding-left: var(--grid-desktop-offset);
    padding-right: var(--grid-desktop-offset);
  }
}
`.trim();
}

// =============================================================================
// LAYOUT INTENT TYPES (for machine-readable layouts)
// =============================================================================

export interface GridLayoutIntent {
  type: 'grid';
  breakpoint?: BreakpointName;
  spans: ResponsiveGridSpan;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

export interface GridLayoutNode {
  id: string;
  type: 'container' | 'item';
  gridIntent?: GridLayoutIntent;
  children?: GridLayoutNode[];
}

/**
 * Resolve layout intent to CSS properties
 */
export function resolveLayoutIntent(intent: GridLayoutIntent): Record<string, string> {
  const css: Record<string, string> = {};
  
  // Handle responsive spans
  const breakpoints: BreakpointName[] = ['mobile', 'tablet', 'desktop'];
  let lastSpan: GridSpan | number | undefined;
  
  for (const bp of breakpoints) {
    const span = intent.spans[bp];
    if (span !== undefined) {
      lastSpan = span;
    }
    // Mobile-first: use last defined span
    if (bp === 'mobile' && lastSpan !== undefined) {
      css.gridColumn = spanToCSS(lastSpan);
    }
  }
  
  // Alignment
  if (intent.alignment) {
    css.justifySelf = intent.alignment;
  }
  
  return css;
}
