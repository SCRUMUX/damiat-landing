/**
 * Layout Spec Module
 * 
 * Exports types, validator, and resolver for the canonical Layout Specification format.
 * 
 * Shared token types (ContainerType, RadiusToken, etc.) are re-exported from
 * their canonical subsystem modules — NOT duplicated here.
 */

export type {
  LayoutSpec,
  LayoutNode,
  LayoutNodeType,
  ContainerConfig,
  GridPlacement,
  SpacingConfig,
  SpacingIntent,
  ResponsiveValue,
  // Re-exported from subsystems via layout-spec-types
  ContainerType,
  ContainerVariant,
  RadiusToken,
  ElevationToken,
  BackgroundToken,
  SpaceCategory,
  SpaceSize,
  SpacingSide,
  BreakpointName,
} from './layout-spec-types';

export { validateLayoutSpec } from './layout-spec-validator';
export type { ValidationResult } from './layout-spec-validator';

export { loadLayoutSpec, loadLayoutSpecPartial } from './layout-spec-resolver';
export type { ResolvedNode, ResolvedLayout, ResolveResult, NodeDiagnostic } from './layout-spec-resolver';
