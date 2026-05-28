/**
 * Overlay System Foundation
 * 
 * Token-driven overlay abstractions for modals, dialogs, and scrims.
 * 
 * From: Effect.contract.json (scrim, blur effects)
 * From: Color.contract.json (scrim colors)
 */

// =============================================================================
// TYPES
// =============================================================================

export type ScrimVariant = 'light' | 'strong';
export type BlurVariant = 'none' | 'background';

export interface OverlayConfig {
  scrim: ScrimVariant;
  blur?: BlurVariant;
  closeOnClick?: boolean;
  closeOnEscape?: boolean;
  centered?: boolean;
  zIndex?: number;
}

export interface OverlayPosition {
  type: 'centered' | 'top' | 'bottom' | 'left' | 'right' | 'fullscreen';
  offset?: string;
}

// =============================================================================
// CONSTANTS (derived from Effect.contract.json)
// =============================================================================

export const SCRIM_DEFAULTS: Record<ScrimVariant, { opacity: number; usage: string }> = {
  light: {
    opacity: 0.3,
    usage: 'Standard modals and dialogs',
  },
  strong: {
    opacity: 0.45,
    usage: 'Critical dialogs (delete confirmation)',
  },
};

export const BLUR_DEFAULTS: Record<BlurVariant, { blur: number }> = {
  none: { blur: 0 },
  background: { blur: 8 },
};

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  scrim: 'light',
  blur: 'none',
  closeOnClick: true,
  closeOnEscape: true,
  centered: true,
  zIndex: 1000,
};

export const Z_INDEX_LAYERS = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  popover: 1100,
  tooltip: 1200,
  toast: 1300,
} as const;

// =============================================================================
// CSS GENERATION
// =============================================================================

/**
 * Generate scrim CSS
 */
export function generateScrimCSS(variant: ScrimVariant): Record<string, string> {
  return {
    position: 'fixed',
    inset: '0',
    backgroundColor: `var(--color-scrim-${variant})`,
    zIndex: String(Z_INDEX_LAYERS.modal - 1),
  };
}

/**
 * Generate overlay backdrop CSS with blur
 */
export function generateBackdropCSS(
  scrim: ScrimVariant,
  blur: BlurVariant = 'none'
): Record<string, string> {
  const css: Record<string, string> = {
    position: 'fixed',
    inset: '0',
    backgroundColor: `var(--color-scrim-${scrim})`,
    zIndex: String(Z_INDEX_LAYERS.modal - 1),
  };
  
  if (blur !== 'none') {
    css.backdropFilter = `blur(var(--effect-blur-${blur}))`;
    css.WebkitBackdropFilter = `blur(var(--effect-blur-${blur}))`;
  }
  
  return css;
}

/**
 * Generate overlay container CSS
 */
export function generateOverlayContainerCSS(
  position: OverlayPosition,
  zIndex: number = Z_INDEX_LAYERS.modal
): Record<string, string> {
  const baseCSS: Record<string, string> = {
    position: 'fixed',
    zIndex: String(zIndex),
  };
  
  switch (position.type) {
    case 'centered':
      return {
        ...baseCSS,
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-inset-l)',
      };
    case 'top':
      return {
        ...baseCSS,
        top: position.offset ?? '0',
        left: '0',
        right: '0',
      };
    case 'bottom':
      return {
        ...baseCSS,
        bottom: position.offset ?? '0',
        left: '0',
        right: '0',
      };
    case 'left':
      return {
        ...baseCSS,
        top: '0',
        bottom: '0',
        left: position.offset ?? '0',
      };
    case 'right':
      return {
        ...baseCSS,
        top: '0',
        bottom: '0',
        right: position.offset ?? '0',
      };
    case 'fullscreen':
      return {
        ...baseCSS,
        inset: '0',
      };
    default:
      return baseCSS;
  }
}

// =============================================================================
// TAILWIND CLASSES
// =============================================================================

/**
 * Generate Tailwind classes for scrim
 */
export function getScrimTailwindClasses(variant: ScrimVariant): string[] {
  return [
    'fixed',
    'inset-0',
    variant === 'light' ? 'bg-black/30' : 'bg-black/45',
    `z-[${Z_INDEX_LAYERS.modal - 1}]`,
  ];
}

/**
 * Generate Tailwind classes for overlay container
 */
export function getOverlayContainerTailwindClasses(
  position: OverlayPosition['type'],
  blur: BlurVariant = 'none'
): string[] {
  const classes = ['fixed', `z-[${Z_INDEX_LAYERS.modal}]`];
  
  switch (position) {
    case 'centered':
      classes.push('inset-0', 'flex', 'items-center', 'justify-center', 'p-inset-l');
      break;
    case 'top':
      classes.push('top-0', 'left-0', 'right-0');
      break;
    case 'bottom':
      classes.push('bottom-0', 'left-0', 'right-0');
      break;
    case 'left':
      classes.push('top-0', 'bottom-0', 'left-0');
      break;
    case 'right':
      classes.push('top-0', 'bottom-0', 'right-0');
      break;
    case 'fullscreen':
      classes.push('inset-0');
      break;
  }
  
  if (blur === 'background') {
    classes.push('backdrop-blur-background');
  }
  
  return classes;
}

// =============================================================================
// OVERLAY INTENT TYPES (for machine-readable layouts)
// =============================================================================

export interface OverlayIntent {
  type: 'overlay';
  scrim: ScrimVariant;
  blur?: BlurVariant;
  position: OverlayPosition;
  closeOnClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Resolve overlay intent to CSS for both backdrop and container
 */
export function resolveOverlayIntent(intent: OverlayIntent): {
  backdrop: Record<string, string>;
  container: Record<string, string>;
} {
  return {
    backdrop: generateBackdropCSS(intent.scrim, intent.blur),
    container: generateOverlayContainerCSS(intent.position),
  };
}
