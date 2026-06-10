/**
 * Layout Spec Resolver
 * 
 * Single entry point: takes a validated LayoutSpec and resolves all intents
 * into CSS properties or Tailwind classes.
 * 
 * IMPORTANT: This module DELEGATES to subsystem resolvers (container-system,
 * spacing-system, grid-system) instead of reimplementing resolution logic.
 * The subsystem modules are the canonical implementation.
 */

import type {
  LayoutSpec,
  LayoutNode,
  ContainerConfig,
  GridPlacement,
  SpacingConfig,
  SpacingIntent,
} from './layout-spec-types';

import { validateLayoutSpec, type ValidationResult } from './layout-spec-validator';

// Import canonical subsystem resolvers
import {
  generateContainerCSS,
  generateContainerTailwindClasses,
  type ContainerConfig as SubsystemContainerConfig,
} from '../containers/container-system';

import {
  resolveSpacingIntent as subsystemResolveSpacing,
  getSpacingTailwindClass,
  type SpacingIntent as SubsystemSpacingIntent,
} from '../spacing/spacing-system';

import { spanToCSS } from '../grid/grid-system';

// =============================================================================
// RESOLVED OUTPUT
// =============================================================================

export interface NodeDiagnostic {
  nodeId: string;
  severity: 'warning' | 'error';
  message: string;
}

export interface ResolvedNode {
  id: string;
  type: string;
  css: Record<string, string>;
  tailwindClasses: string[];
  children: ResolvedNode[];
  componentRef?: string;
  behaviorId?: string;
  /** Event-specific behavior mappings */
  behaviors?: Record<string, string>;
  /** Diagnostics for this node (warnings/errors during resolution) */
  diagnostics?: NodeDiagnostic[];
}

export interface ResolvedLayout {
  name: string;
  version?: string;
  root: ResolvedNode;
}

export interface ResolveResult {
  success: boolean;
  layout?: ResolvedLayout;
  validation: ValidationResult;
  /** Aggregate diagnostics from all nodes during resolution */
  diagnostics: NodeDiagnostic[];
}

// =============================================================================
// ADAPTER FUNCTIONS (spec shapes → subsystem shapes)
// =============================================================================

/**
 * Adapt spec ContainerConfig to subsystem ContainerConfig.
 * The spec shape has all-optional fields; the subsystem expects `type` to be required.
 */
function adaptContainerConfig(config: ContainerConfig): SubsystemContainerConfig {
  return {
    type: config.type ?? 'content',
    variant: config.variant,
    padding: config.padding
      ? { category: config.padding.category, size: config.padding.size }
      : undefined,
    radius: config.radius,
    elevation: config.elevation,
    background: config.background,
    border: config.border,
    maxWidth: config.maxWidth ? undefined : undefined, // maxWidth uses different types; handled separately
  };
}

/**
 * Adapt spec SpacingIntent to a subsystem SpacingIntent with the required `type` field.
 */
function adaptSpacingIntent(intent: SpacingIntent, property: 'padding' | 'margin' | 'gap'): SubsystemSpacingIntent {
  return {
    type: property,
    category: intent.category,
    size: intent.size,
    side: intent.side,
  };
}

// =============================================================================
// INTERNAL RESOLVERS (delegating to subsystems)
// =============================================================================

function resolveContainer(config: ContainerConfig): { css: Record<string, string>; tw: string[] } {
  const adapted = adaptContainerConfig(config);
  const css = generateContainerCSS(adapted);
  const tw = generateContainerTailwindClasses(adapted);

  // Handle maxWidth from spec (string type, e.g. "1440px") separately
  if (config.maxWidth) {
    css.maxWidth = config.maxWidth;
  }

  return { css, tw };
}

function resolveGrid(config: GridPlacement): { css: Record<string, string>; tw: string[] } {
  const css: Record<string, string> = {};
  const tw: string[] = [];

  if (config.spans) {
    // Mobile-first: set base gridColumn from mobile span
    if (config.spans.mobile) {
      css.gridColumn = spanToCSS(config.spans.mobile);
      tw.push(`col-span-${config.spans.mobile}`);
    }
    if (config.spans.tablet) {
      tw.push(`tablet:col-span-${config.spans.tablet}`);
    }
    if (config.spans.desktop) {
      tw.push(`desktop:col-span-${config.spans.desktop}`);
    }
  }
  if (config.alignment) {
    css.justifySelf = config.alignment;
    tw.push(`justify-self-${config.alignment}`);
  }

  return { css, tw };
}

function resolveSpacing(config: SpacingConfig): { css: Record<string, string>; tw: string[] } {
  const css: Record<string, string> = {};
  const tw: string[] = [];

  if (config.margin) {
    const adapted = adaptSpacingIntent(config.margin, 'margin');
    Object.assign(css, subsystemResolveSpacing(adapted));
    tw.push(getSpacingTailwindClass('m', config.margin.category, config.margin.size, config.margin.side));
  }
  if (config.padding) {
    const adapted = adaptSpacingIntent(config.padding, 'padding');
    Object.assign(css, subsystemResolveSpacing(adapted));
    tw.push(getSpacingTailwindClass('p', config.padding.category, config.padding.size, config.padding.side));
  }
  if (config.gap) {
    const adapted = adaptSpacingIntent(config.gap, 'gap');
    Object.assign(css, subsystemResolveSpacing(adapted));
    tw.push(getSpacingTailwindClass('gap', config.gap.category, config.gap.size));
  }

  return { css, tw };
}

// =============================================================================
// NODE RESOLVER
// =============================================================================

function resolveNode(node: LayoutNode, allDiagnostics: NodeDiagnostic[]): ResolvedNode {
  const css: Record<string, string> = {};
  const tw: string[] = [];
  const diagnostics: NodeDiagnostic[] = [];

  // Container — delegates to container-system
  if (node.container) {
    try {
      const c = resolveContainer(node.container);
      Object.assign(css, c.css);
      tw.push(...c.tw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      diagnostics.push({ nodeId: node.id, severity: 'error', message: `Container resolution failed: ${msg}` });
    }
  }

  // Grid placement — uses grid-system utilities
  if (node.grid) {
    try {
      const g = resolveGrid(node.grid);
      Object.assign(css, g.css);
      tw.push(...g.tw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      diagnostics.push({ nodeId: node.id, severity: 'error', message: `Grid resolution failed: ${msg}` });
    }
  }

  // Spacing — delegates to spacing-system
  if (node.spacing) {
    try {
      const s = resolveSpacing(node.spacing);
      Object.assign(css, s.css);
      tw.push(...s.tw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      diagnostics.push({ nodeId: node.id, severity: 'error', message: `Spacing resolution failed: ${msg}` });
    }
  }

  // Warn about unresolved component references
  if (node.componentRef) {
    diagnostics.push({ nodeId: node.id, severity: 'warning', message: `componentRef "${node.componentRef}" must be bound by the application layer` });
  }
  if (node.behaviorId) {
    diagnostics.push({ nodeId: node.id, severity: 'warning', message: `behaviorId "${node.behaviorId}" must be resolved via the Behavior Registry` });
  }

  // Collect into aggregate
  allDiagnostics.push(...diagnostics);

  // Recurse into children
  const children = (node.children || []).map(child => resolveNode(child, allDiagnostics));

  return {
    id: node.id,
    type: node.type,
    css,
    tailwindClasses: tw.filter(Boolean),
    children,
    componentRef: node.componentRef,
    behaviorId: node.behaviorId,
    behaviors: node.behaviors,
    diagnostics: diagnostics.length > 0 ? diagnostics : undefined,
  };
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Strict entry point: validate + resolve a Layout Spec into CSS/Tailwind output.
 * Rejects invalid specs entirely.
 */
export function loadLayoutSpec(spec: unknown): ResolveResult {
  const validation = validateLayoutSpec(spec);

  if (!validation.valid) {
    return { success: false, validation, diagnostics: [] };
  }

  const layoutSpec = spec as LayoutSpec;
  const diagnostics: NodeDiagnostic[] = [];
  const root = resolveNode(layoutSpec.root, diagnostics);

  return {
    success: true,
    layout: {
      name: layoutSpec.name,
      version: layoutSpec.version,
      root,
    },
    validation,
    diagnostics,
  };
}

/**
 * Partial (lenient) entry point: resolve what is valid, annotate what is not.
 * Returns a usable (if incomplete) result alongside diagnostics.
 * Use this when consuming specs from automated generators that may produce
 * imperfect input.
 */
export function loadLayoutSpecPartial(spec: unknown): ResolveResult {
  const validation = validateLayoutSpec(spec);
  const diagnostics: NodeDiagnostic[] = [];

  // Even if validation fails, attempt resolution of the root if it exists
  const s = spec as Record<string, unknown> | null;
  if (!s || typeof s !== 'object' || !s.root) {
    return {
      success: false,
      validation,
      diagnostics: [{ nodeId: 'root', severity: 'error', message: 'No root node to resolve' }],
    };
  }

  // Add validation errors as diagnostics
  for (const err of validation.errors) {
    diagnostics.push({ nodeId: 'validation', severity: 'warning', message: err });
  }

  try {
    const root = resolveNode(s.root as LayoutNode, diagnostics);
    return {
      success: true,
      layout: {
        name: (s.name as string) || 'unknown',
        version: s.version as string | undefined,
        root,
      },
      validation,
      diagnostics,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    diagnostics.push({ nodeId: 'root', severity: 'error', message: `Root resolution failed: ${msg}` });
    return { success: false, validation, diagnostics };
  }
}
