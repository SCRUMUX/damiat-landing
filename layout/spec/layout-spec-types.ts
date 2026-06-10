/**
 * Layout Spec Types
 * 
 * Canonical TypeScript types for the Layout Specification format.
 * Aligned with schemas/layout-spec.schema.json.
 * 
 * IMPORTANT: Shared token types are imported from subsystem modules
 * to maintain a single source of truth. Only spec-specific types
 * (tree structure, spec config shapes) are defined here.
 */

// Re-export shared token types from canonical subsystem modules
export type {
  ContainerType,
  ContainerVariant,
  RadiusToken,
  ElevationToken,
  BackgroundToken,
} from '../containers/container-system';

export type {
  SpaceCategory,
  SpaceSize,
  SpacingSide,
} from '../spacing/spacing-system';

export type {
  BreakpointName,
} from '../grid/grid-system';

// Import for use in local type definitions
import type { ContainerType, ContainerVariant, RadiusToken, ElevationToken, BackgroundToken } from '../containers/container-system';
import type { SpaceCategory, SpaceSize, SpacingSide } from '../spacing/spacing-system';

// =============================================================================
// SPACING INTENT (spec-specific shape — no `type` field, property is contextual)
// =============================================================================

export interface SpacingIntent {
  category: SpaceCategory;
  size: SpaceSize;
  side?: SpacingSide;
}

// =============================================================================
// RESPONSIVE VALUE
// =============================================================================

export interface ResponsiveValue {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

// =============================================================================
// CONTAINER CONFIG (spec-specific — all fields optional for declarative specs)
// =============================================================================

export interface ContainerConfig {
  type?: ContainerType;
  variant?: ContainerVariant;
  padding?: SpacingIntent;
  radius?: RadiusToken;
  elevation?: ElevationToken;
  background?: BackgroundToken;
  border?: boolean;
  maxWidth?: string;
}

// =============================================================================
// GRID PLACEMENT (spec-specific — describes placement within a grid, not grid definition)
// =============================================================================

export interface GridPlacement {
  spans?: ResponsiveValue;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

// =============================================================================
// SPACING CONFIG
// =============================================================================

export interface SpacingConfig {
  margin?: SpacingIntent;
  padding?: SpacingIntent;
  gap?: SpacingIntent;
}

// =============================================================================
// LAYOUT NODE
// =============================================================================

export type LayoutNodeType = 'container' | 'grid-item' | 'spacer';

export interface LayoutNode {
  id: string;
  type: LayoutNodeType;
  container?: ContainerConfig;
  grid?: GridPlacement;
  spacing?: SpacingConfig;
  children?: LayoutNode[];
  componentRef?: string;
  /** Shorthand: single behavior ID (typically for click) */
  behaviorId?: string;
  /** Event-specific behavior mappings from the Behavior Registry */
  behaviors?: Record<string, string>;
}

// =============================================================================
// LAYOUT SPEC (root)
// =============================================================================

export interface LayoutSpec {
  type: 'layout';
  name: string;
  version?: string;
  root: LayoutNode;
}
