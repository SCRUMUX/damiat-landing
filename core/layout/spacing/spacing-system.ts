/**
 * Spacing System Foundation
 * 
 * Token-driven spacing system abstractions for machine-readable layout generation.
 * 
 * From: Space.contract.json
 * 
 * Semantic Categories:
 * - layout: Margins between large sections
 * - content: Gaps within content blocks
 * - control: Padding/gaps for interactive elements
 * - inset: Padding for containers
 */

// =============================================================================
// TYPES
// =============================================================================

export type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type SpaceCategory = 'layout' | 'content' | 'control' | 'inset';

export interface SpaceIntent {
  category: SpaceCategory;
  size: SpaceSize;
}

export type SpacingSide = 'top' | 'right' | 'bottom' | 'left' | 'x' | 'y' | 'all';

export interface SpacingSpec {
  category: SpaceCategory;
  size: SpaceSize;
  side: SpacingSide;
}

// =============================================================================
// CONSTANTS (derived from Space.contract.json)
// =============================================================================

/**
 * Primitive space values in pixels
 * These are the raw values - use semantic tokens in production
 */
export const SPACE_PRIMITIVES = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  6: 6,
  8: 8,
  9: 9,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
} as const;

/**
 * Semantic spacing mappings
 * Maps category + size to primitive space token
 */
export const SPACE_SEMANTICS: Record<SpaceCategory, Record<SpaceSize, number>> = {
  layout: {
    xs: 1,
    s: 2,
    m: 3,
    l: 6,
    xl: 9,
  },
  content: {
    xs: 2,
    s: 4,
    m: 6,
    l: 9,
    xl: 12, // extended
  },
  control: {
    xs: 1,
    s: 2,
    m: 3,
    l: 4,
    xl: 6, // extended
  },
  inset: {
    xs: 4,
    s: 6,
    m: 9,
    l: 12,
    xl: 16,
  },
};

/**
 * CSS property mapping for spacing sides
 */
export const SPACING_PROPERTY_MAP: Record<SpacingSide, string[]> = {
  top: ['padding-top', 'margin-top'],
  right: ['padding-right', 'margin-right'],
  bottom: ['padding-bottom', 'margin-bottom'],
  left: ['padding-left', 'margin-left'],
  x: ['padding-left', 'padding-right', 'margin-left', 'margin-right'],
  y: ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'],
  all: ['padding', 'margin'],
};

// =============================================================================
// SPACING UTILITIES
// =============================================================================

/**
 * Get CSS variable name for a space token
 */
export function getSpaceVarName(category: SpaceCategory, size: SpaceSize): string {
  return `--space-${category}-${size}`;
}

/**
 * Get CSS variable reference for a space token
 */
export function getSpaceVar(category: SpaceCategory, size: SpaceSize): string {
  return `var(${getSpaceVarName(category, size)})`;
}

/**
 * Get primitive space CSS variable
 */
export function getPrimitiveSpaceVar(value: keyof typeof SPACE_PRIMITIVES): string {
  return `var(--space-${value})`;
}

/**
 * Validate spacing specification
 */
export function validateSpacingSpec(spec: SpacingSpec): { valid: boolean; error?: string } {
  const validCategories: SpaceCategory[] = ['layout', 'content', 'control', 'inset'];
  const validSizes: SpaceSize[] = ['xs', 's', 'm', 'l', 'xl'];
  const validSides: SpacingSide[] = ['top', 'right', 'bottom', 'left', 'x', 'y', 'all'];
  
  if (!validCategories.includes(spec.category)) {
    return { valid: false, error: `Invalid category: ${spec.category}` };
  }
  
  if (!validSizes.includes(spec.size)) {
    return { valid: false, error: `Invalid size: ${spec.size}` };
  }
  
  if (!validSides.includes(spec.side)) {
    return { valid: false, error: `Invalid side: ${spec.side}` };
  }
  
  // Validate semantic constraints
  if (spec.category === 'layout' && spec.side === 'all') {
    return { valid: false, error: 'Layout spacing should not use "all" - use margin directionally' };
  }
  
  if (spec.category === 'inset' && !['all', 'x', 'y'].includes(spec.side)) {
    // Warning: inset is typically used for all-around padding
    console.warn('Inset spacing is typically used for padding all around');
  }
  
  return { valid: true };
}

// =============================================================================
// CSS GENERATION
// =============================================================================

/**
 * Generate padding CSS from spacing specification
 */
export function generatePaddingCSS(spec: SpacingSpec): Record<string, string> {
  const varRef = getSpaceVar(spec.category, spec.size);
  const css: Record<string, string> = {};
  
  switch (spec.side) {
    case 'all':
      css.padding = varRef;
      break;
    case 'x':
      css.paddingLeft = varRef;
      css.paddingRight = varRef;
      break;
    case 'y':
      css.paddingTop = varRef;
      css.paddingBottom = varRef;
      break;
    default:
      css[`padding${capitalize(spec.side)}`] = varRef;
  }
  
  return css;
}

/**
 * Generate margin CSS from spacing specification
 */
export function generateMarginCSS(spec: SpacingSpec): Record<string, string> {
  const varRef = getSpaceVar(spec.category, spec.size);
  const css: Record<string, string> = {};
  
  switch (spec.side) {
    case 'all':
      css.margin = varRef;
      break;
    case 'x':
      css.marginLeft = varRef;
      css.marginRight = varRef;
      break;
    case 'y':
      css.marginTop = varRef;
      css.marginBottom = varRef;
      break;
    default:
      css[`margin${capitalize(spec.side)}`] = varRef;
  }
  
  return css;
}

/**
 * Generate gap CSS for flex/grid containers
 */
export function generateGapCSS(category: SpaceCategory, size: SpaceSize): Record<string, string> {
  return {
    gap: getSpaceVar(category, size),
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// SPACING INTENT TYPES (for machine-readable layouts)
// =============================================================================

export interface SpacingIntent {
  type: 'padding' | 'margin' | 'gap';
  category: SpaceCategory;
  size: SpaceSize;
  side?: SpacingSide;
}

/**
 * Resolve spacing intent to CSS properties
 */
export function resolveSpacingIntent(intent: SpacingIntent): Record<string, string> {
  const spec: SpacingSpec = {
    category: intent.category,
    size: intent.size,
    side: intent.side ?? 'all',
  };
  
  switch (intent.type) {
    case 'padding':
      return generatePaddingCSS(spec);
    case 'margin':
      return generateMarginCSS(spec);
    case 'gap':
      return generateGapCSS(intent.category, intent.size);
    default:
      return {};
  }
}

// =============================================================================
// TAILWIND CLASS MAPPING
// =============================================================================

/**
 * Get Tailwind class for spacing
 */
export function getSpacingTailwindClass(
  type: 'p' | 'm' | 'gap',
  category: SpaceCategory,
  size: SpaceSize,
  side?: SpacingSide
): string {
  const sizeMap: Record<SpacingSpec['side'], string> = {
    top: 't',
    right: 'r',
    bottom: 'b',
    left: 'l',
    x: 'x',
    y: 'y',
    all: '',
  };
  
  const sidePrefix = side && side !== 'all' ? sizeMap[side] : '';
  const tokenName = `${category}-${size}`;
  
  if (type === 'gap') {
    return `gap-${tokenName}`;
  }
  
  return `${type}${sidePrefix}-${tokenName}`;
}
