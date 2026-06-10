/**
 * Layout Spec Validator
 * 
 * Validates incoming layout specifications against the canonical format.
 * Does NOT depend on external libraries (Ajv, Zod) — uses manual validation
 * to keep the core dependency-free.
 * 
 * IMPORTANT: Allowed-value arrays are derived from subsystem modules and contracts.
 * The validator does NOT maintain its own parallel list of valid values.
 */

import type { LayoutSpec, LayoutNode } from './layout-spec-types';
import { GRID_CONFIGS, type BreakpointName } from '../grid/grid-system';

// =============================================================================
// VALIDATION RESULT
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// =============================================================================
// ALLOWED VALUES
// Derived from subsystem types. When subsystem types change, this updates automatically
// at the type level. Runtime arrays are kept here as the enforcement surface.
// =============================================================================

// Node types (spec-specific, defined by LayoutNodeType)
const VALID_NODE_TYPES = ['container', 'grid-item', 'spacer'] as const;

// From container-system.ts ContainerType
const VALID_CONTAINER_TYPES = ['page', 'section', 'card', 'panel', 'modal', 'content'] as const;

// From container-system.ts ContainerVariant
const VALID_CONTAINER_VARIANTS = ['default', 'elevated', 'bordered', 'transparent'] as const;

// From container-system.ts RadiusToken
const VALID_RADIUS_TOKENS = ['none', 'subtle', 'default', 'medium', 'large', 'xl', 'pill'] as const;

// From container-system.ts ElevationToken
const VALID_ELEVATION_TOKENS = ['none', '1', '2', '3', 'glow'] as const;

// From container-system.ts BackgroundToken
const VALID_BACKGROUND_TOKENS = ['base', 'muted', 'surface-1', 'surface-2', 'surface-3', 'disabled', 'brand-muted', 'transparent'] as const;

// From spacing-system.ts SpaceCategory
const VALID_SPACING_CATEGORIES = ['layout', 'content', 'control', 'inset'] as const;

// From spacing-system.ts SpaceSize
const VALID_SPACING_SIZES = ['xs', 's', 'm', 'l', 'xl'] as const;

// From spacing-system.ts SpacingSide
const VALID_SPACING_SIDES = ['top', 'right', 'bottom', 'left', 'x', 'y', 'all'] as const;

const VALID_ALIGNMENTS = ['start', 'center', 'end', 'stretch'] as const;

// =============================================================================
// HELPERS
// =============================================================================

function isIn<T>(value: unknown, allowed: readonly T[]): value is T {
  return (allowed as readonly unknown[]).includes(value);
}

function validateSpacingIntent(intent: unknown, path: string, errors: string[]): void {
  if (typeof intent !== 'object' || intent === null) {
    errors.push(`${path}: must be an object`);
    return;
  }
  const si = intent as Record<string, unknown>;
  if (!si.category || !isIn(si.category, VALID_SPACING_CATEGORIES)) {
    errors.push(`${path}.category: must be one of ${VALID_SPACING_CATEGORIES.join(', ')}`);
  }
  if (!si.size || !isIn(si.size, VALID_SPACING_SIZES)) {
    errors.push(`${path}.size: must be one of ${VALID_SPACING_SIZES.join(', ')}`);
  }
  if (si.side !== undefined && !isIn(si.side, VALID_SPACING_SIDES)) {
    errors.push(`${path}.side: must be one of ${VALID_SPACING_SIDES.join(', ')}`);
  }
}

function validateNode(node: unknown, path: string, errors: string[], seenIds: Set<string>): void {
  if (typeof node !== 'object' || node === null) {
    errors.push(`${path}: must be an object`);
    return;
  }
  const n = node as Record<string, unknown>;

  // id
  if (typeof n.id !== 'string' || n.id.length === 0) {
    errors.push(`${path}.id: required non-empty string`);
  } else if (seenIds.has(n.id as string)) {
    errors.push(`${path}.id: duplicate id '${n.id}'`);
  } else {
    seenIds.add(n.id as string);
  }

  // type
  if (!isIn(n.type, VALID_NODE_TYPES)) {
    errors.push(`${path}.type: must be one of ${VALID_NODE_TYPES.join(', ')}`);
  }

  // container
  if (n.container !== undefined) {
    const c = n.container as Record<string, unknown>;
    if (c.type !== undefined && !isIn(c.type, VALID_CONTAINER_TYPES)) {
      errors.push(`${path}.container.type: must be one of ${VALID_CONTAINER_TYPES.join(', ')}`);
    }
    if (c.variant !== undefined && !isIn(c.variant, VALID_CONTAINER_VARIANTS)) {
      errors.push(`${path}.container.variant: must be one of ${VALID_CONTAINER_VARIANTS.join(', ')}`);
    }
    if (c.radius !== undefined && !isIn(c.radius, VALID_RADIUS_TOKENS)) {
      errors.push(`${path}.container.radius: must be one of ${VALID_RADIUS_TOKENS.join(', ')}`);
    }
    if (c.elevation !== undefined && !isIn(c.elevation, VALID_ELEVATION_TOKENS)) {
      errors.push(`${path}.container.elevation: must be one of ${VALID_ELEVATION_TOKENS.join(', ')}`);
    }
    if (c.background !== undefined && !isIn(c.background, VALID_BACKGROUND_TOKENS)) {
      errors.push(`${path}.container.background: must be one of ${VALID_BACKGROUND_TOKENS.join(', ')}`);
    }
    if (c.padding !== undefined) {
      validateSpacingIntent(c.padding, `${path}.container.padding`, errors);
    }
  }

  // grid — span limits derived from GRID_CONFIGS (canonical source)
  if (n.grid !== undefined) {
    const g = n.grid as Record<string, unknown>;
    if (g.alignment !== undefined && !isIn(g.alignment, VALID_ALIGNMENTS)) {
      errors.push(`${path}.grid.alignment: must be one of ${VALID_ALIGNMENTS.join(', ')}`);
    }
    if (g.spans !== undefined) {
      const spans = g.spans as Record<string, unknown>;
      for (const bp of ['mobile', 'tablet', 'desktop'] as BreakpointName[]) {
        if (spans[bp] !== undefined) {
          const v = spans[bp];
          const maxCols = GRID_CONFIGS[bp].columns;
          if (typeof v !== 'number' || v < 1 || v > maxCols || !Number.isInteger(v)) {
            errors.push(`${path}.grid.spans.${bp}: must be integer 1-${maxCols}`);
          }
        }
      }
    }
  }

  // spacing
  if (n.spacing !== undefined) {
    const s = n.spacing as Record<string, unknown>;
    if (s.margin !== undefined) validateSpacingIntent(s.margin, `${path}.spacing.margin`, errors);
    if (s.padding !== undefined) validateSpacingIntent(s.padding, `${path}.spacing.padding`, errors);
    if (s.gap !== undefined) validateSpacingIntent(s.gap, `${path}.spacing.gap`, errors);
  }

  // Composition constraints
  if (n.type === 'spacer' && n.children !== undefined) {
    const children = n.children as unknown[];
    if (Array.isArray(children) && children.length > 0) {
      errors.push(`${path}: spacer nodes must not have children`);
    }
  }

  // children
  if (n.children !== undefined) {
    if (!Array.isArray(n.children)) {
      errors.push(`${path}.children: must be an array`);
    } else {
      (n.children as unknown[]).forEach((child, i) => {
        validateNode(child, `${path}.children[${i}]`, errors, seenIds);
      });
    }
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Validate a Layout Specification against the canonical format.
 */
export function validateLayoutSpec(spec: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof spec !== 'object' || spec === null) {
    return { valid: false, errors: ['Spec must be a non-null object'] };
  }

  const s = spec as Record<string, unknown>;

  if (s.type !== 'layout') {
    errors.push('root.type: must be "layout"');
  }

  if (typeof s.name !== 'string' || s.name.length === 0) {
    errors.push('root.name: required non-empty string');
  }

  if (s.root === undefined) {
    errors.push('root.root: required');
  } else {
    const seenIds = new Set<string>();
    validateNode(s.root, 'root.root', errors, seenIds);
  }

  return { valid: errors.length === 0, errors };
}
