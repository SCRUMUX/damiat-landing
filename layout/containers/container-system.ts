/**
 * Container System Foundation
 * 
 * Token-driven container abstractions for machine-readable layout generation.
 * Containers are the primary building blocks for page structure.
 * 
 * Integrates with:
 * - Layout.contract.json (grid constraints)
 * - Space.contract.json (padding/margins)
 * - Radius.contract.json (border-radius)
 * - Effect.contract.json (elevation)
 * - Color.contract.json (background/border)
 */

import { BreakpointName, BREAKPOINTS, GRID_CONFIGS } from '../grid/grid-system';
import { SpaceCategory, SpaceSize, getSpaceVar } from '../spacing/spacing-system';

// =============================================================================
// TYPES
// =============================================================================

export type ContainerType = 
  | 'page'      // Full page container with grid constraints
  | 'section'   // Page section
  | 'card'      // Card container
  | 'panel'     // Side panel
  | 'modal'     // Modal dialog
  | 'content';  // Content block

export type ContainerVariant = 'default' | 'elevated' | 'bordered' | 'transparent';

export interface ContainerConfig {
  type: ContainerType;
  variant?: ContainerVariant;
  padding?: {
    category: SpaceCategory;
    size: SpaceSize;
  };
  radius?: RadiusToken;
  elevation?: ElevationToken;
  background?: BackgroundToken;
  border?: boolean;
  maxWidth?: 'mobile' | 'tablet' | 'desktop' | 'full' | number;
}

export type RadiusToken = 'none' | 'subtle' | 'default' | 'medium' | 'large' | 'xl' | 'pill';
export type ElevationToken = '1' | '2' | '3' | 'glow' | 'none';
export type BackgroundToken = 'base' | 'muted' | 'surface-1' | 'surface-2' | 'surface-3' | 'disabled' | 'brand-muted' | 'transparent';

// =============================================================================
// CONTAINER DEFAULTS (based on contracts)
// =============================================================================

export const CONTAINER_DEFAULTS: Record<ContainerType, Partial<ContainerConfig>> = {
  page: {
    variant: 'transparent',
    padding: { category: 'inset', size: 'l' },
    radius: 'none',
    elevation: 'none',
    background: 'base',
    maxWidth: 'desktop',
  },
  section: {
    variant: 'transparent',
    padding: { category: 'inset', size: 'm' },
    radius: 'none',
    elevation: 'none',
    background: 'transparent',
  },
  card: {
    variant: 'elevated',
    padding: { category: 'inset', size: 'm' },
    radius: 'medium',
    elevation: '2',
    background: 'surface-1',
    border: false,
  },
  panel: {
    variant: 'bordered',
    padding: { category: 'inset', size: 'm' },
    radius: 'default',
    elevation: 'none',
    background: 'surface-1',
    border: true,
  },
  modal: {
    variant: 'elevated',
    padding: { category: 'inset', size: 'l' },
    radius: 'large',
    elevation: '3',
    background: 'surface-1',
    border: false,
  },
  content: {
    variant: 'transparent',
    padding: { category: 'content', size: 'm' },
    radius: 'none',
    elevation: 'none',
    background: 'transparent',
  },
};

// =============================================================================
// CSS VARIABLE MAPPINGS
// =============================================================================

const RADIUS_VAR_MAP: Record<RadiusToken, string> = {
  none: 'var(--radius-none)',
  subtle: 'var(--radius-subtle)',
  default: 'var(--radius-default)',
  medium: 'var(--radius-medium)',
  large: 'var(--radius-large)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
};

const ELEVATION_VAR_MAP: Record<ElevationToken, string> = {
  none: 'none',
  '1': 'var(--effect-elevation-1)',
  '2': 'var(--effect-elevation-2)',
  '3': 'var(--effect-elevation-3)',
  glow: 'var(--effect-elevation-glow)',
};

const BACKGROUND_VAR_MAP: Record<BackgroundToken, string> = {
  base: 'var(--color-bg-base)',
  muted: 'var(--color-bg-muted)',
  'surface-1': 'var(--color-surface-1)',
  'surface-2': 'var(--color-surface-2)',
  'surface-3': 'var(--color-surface-3)',
  disabled: 'var(--color-bg-disabled)',
  'brand-muted': 'var(--color-brand-muted)',
  transparent: 'transparent',
};

// =============================================================================
// CONTAINER UTILITIES
// =============================================================================

/**
 * Merge container config with defaults
 */
export function resolveContainerConfig(config: ContainerConfig): Required<ContainerConfig> {
  const defaults = CONTAINER_DEFAULTS[config.type];
  return {
    type: config.type,
    variant: config.variant ?? defaults.variant ?? 'default',
    padding: config.padding ?? defaults.padding ?? { category: 'inset', size: 'm' },
    radius: config.radius ?? defaults.radius ?? 'default',
    elevation: config.elevation ?? defaults.elevation ?? 'none',
    background: config.background ?? defaults.background ?? 'surface-1',
    border: config.border ?? defaults.border ?? false,
    maxWidth: config.maxWidth ?? defaults.maxWidth ?? 'full',
  };
}

/**
 * Get max-width value for container
 */
export function getContainerMaxWidth(maxWidth: ContainerConfig['maxWidth']): string {
  if (typeof maxWidth === 'number') {
    return `${maxWidth}px`;
  }
  
  switch (maxWidth) {
    case 'mobile':
      return `${BREAKPOINTS.mobile.max}px`;
    case 'tablet':
      return `${BREAKPOINTS.tablet.max}px`;
    case 'desktop':
      return '1440px';
    case 'full':
    default:
      return '100%';
  }
}

// =============================================================================
// CSS GENERATION
// =============================================================================

/**
 * Generate CSS for container
 */
export function generateContainerCSS(config: ContainerConfig): Record<string, string> {
  const resolved = resolveContainerConfig(config);
  const css: Record<string, string> = {};
  
  // Padding
  if (resolved.padding) {
    css.padding = getSpaceVar(resolved.padding.category, resolved.padding.size);
  }
  
  // Border radius
  css.borderRadius = RADIUS_VAR_MAP[resolved.radius];
  
  // Elevation (box-shadow)
  if (resolved.elevation !== 'none') {
    css.boxShadow = ELEVATION_VAR_MAP[resolved.elevation];
  }
  
  // Background
  css.backgroundColor = BACKGROUND_VAR_MAP[resolved.background];
  
  // Border
  if (resolved.border) {
    css.border = '1px solid var(--color-border-base)';
  }
  
  // Max width
  if (resolved.maxWidth !== 'full') {
    css.maxWidth = getContainerMaxWidth(resolved.maxWidth);
    css.marginLeft = 'auto';
    css.marginRight = 'auto';
  }
  
  return css;
}

/**
 * Generate Tailwind classes for container
 */
export function generateContainerTailwindClasses(config: ContainerConfig): string[] {
  const resolved = resolveContainerConfig(config);
  const classes: string[] = [];
  
  // Padding
  if (resolved.padding) {
    classes.push(`p-${resolved.padding.category}-${resolved.padding.size}`);
  }
  
  // Border radius
  classes.push(`rounded-${resolved.radius}`);
  
  // Elevation
  if (resolved.elevation !== 'none') {
    classes.push(`shadow-elevation-${resolved.elevation}`);
  }
  
  // Background
  if (resolved.background !== 'transparent') {
    classes.push(`bg-${resolved.background}`);
  }
  
  // Border
  if (resolved.border) {
    classes.push('border', 'border-border-base');
  }
  
  // Max width
  if (resolved.maxWidth === 'desktop') {
    classes.push('max-w-[1440px]', 'mx-auto');
  } else if (resolved.maxWidth !== 'full') {
    classes.push(`max-w-${resolved.maxWidth}`, 'mx-auto');
  }
  
  return classes;
}

// =============================================================================
// CONTAINER INTENT TYPES (for machine-readable layouts)
// =============================================================================

export interface ContainerIntent {
  type: 'container';
  containerType: ContainerType;
  variant?: ContainerVariant;
  padding?: {
    category: SpaceCategory;
    size: SpaceSize;
  };
  radius?: RadiusToken;
  elevation?: ElevationToken;
  background?: BackgroundToken;
  border?: boolean;
  maxWidth?: ContainerConfig['maxWidth'];
}

/**
 * Resolve container intent to CSS properties
 */
export function resolveContainerIntent(intent: ContainerIntent): Record<string, string> {
  return generateContainerCSS({
    type: intent.containerType,
    variant: intent.variant,
    padding: intent.padding,
    radius: intent.radius,
    elevation: intent.elevation,
    background: intent.background,
    border: intent.border,
    maxWidth: intent.maxWidth,
  });
}
