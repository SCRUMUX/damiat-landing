/**
 * Layout System - Main Entry Point
 * 
 * Exports all layout system abstractions for use in applications.
 */

// Grid System
export {
  // Types
  type BreakpointName,
  type GridConfig,
  type GridSpan,
  type ResponsiveGridSpan,
  type GridLayoutIntent,
  type GridLayoutNode,
  
  // Constants
  BREAKPOINTS,
  GRID_CONFIGS,
  
  // Utilities
  getCurrentBreakpoint,
  getGridConfig,
  getMaxColumns,
  validateGridSpan,
  normalizeSpan,
  
  // CSS Generation
  spanToCSS,
  generateResponsiveGridCSS,
  generateGridContainerCSS,
  generateResponsiveGridContainerCSS,
  
  // Intent Resolution
  resolveLayoutIntent,
} from './grid/grid-system';

// Spacing System
export {
  // Types
  type SpaceSize,
  type SpaceCategory,
  type SpaceIntent,
  type SpacingSide,
  type SpacingSpec,
  type SpacingIntent,
  
  // Constants
  SPACE_PRIMITIVES,
  SPACE_SEMANTICS,
  SPACING_PROPERTY_MAP,
  
  // Utilities
  getSpaceVarName,
  getSpaceVar,
  getPrimitiveSpaceVar,
  validateSpacingSpec,
  
  // CSS Generation
  generatePaddingCSS,
  generateMarginCSS,
  generateGapCSS,
  
  // Intent Resolution
  resolveSpacingIntent,
  
  // Tailwind
  getSpacingTailwindClass,
} from './spacing/spacing-system';

// Container System
export {
  // Types
  type ContainerType,
  type ContainerVariant,
  type ContainerConfig,
  type RadiusToken,
  type ElevationToken,
  type BackgroundToken,
  type ContainerIntent,
  
  // Constants
  CONTAINER_DEFAULTS,
  
  // Utilities
  resolveContainerConfig,
  getContainerMaxWidth,
  
  // CSS Generation
  generateContainerCSS,
  generateContainerTailwindClasses,
  
  // Intent Resolution
  resolveContainerIntent,
} from './containers/container-system';

// Overlay System
export {
  // Types
  type ScrimVariant,
  type BlurVariant,
  type OverlayConfig,
  type OverlayPosition,
  type OverlayIntent,
  
  // Constants
  SCRIM_DEFAULTS,
  BLUR_DEFAULTS,
  DEFAULT_OVERLAY_CONFIG,
  Z_INDEX_LAYERS,
  
  // CSS Generation
  generateScrimCSS,
  generateBackdropCSS,
  generateOverlayContainerCSS,
  
  // Tailwind
  getScrimTailwindClasses,
  getOverlayContainerTailwindClasses,
  
  // Intent Resolution
  resolveOverlayIntent,
} from './overlays/overlay-system';

// Layout Spec (canonical format, validator, resolver)
// Note: shared token types (ContainerType, RadiusToken, etc.) are already
// exported above from their canonical subsystem modules.
export {
  // Spec-specific types
  type LayoutSpec,
  type LayoutNode as LayoutSpecNode,
  type LayoutNodeType,
  type ContainerConfig as SpecContainerConfig,
  type GridPlacement,
  type SpacingConfig as SpecSpacingConfig,
  type SpacingIntent as SpecSpacingIntent,
  type ResponsiveValue,
  type ResolvedNode,
  type ResolvedLayout,
  type ResolveResult,
  type NodeDiagnostic,
  type ValidationResult,

  // Functions
  validateLayoutSpec,
  loadLayoutSpec,
  loadLayoutSpecPartial,
} from './spec';
