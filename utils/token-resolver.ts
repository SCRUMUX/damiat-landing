/**
 * Token Resolver Utilities
 * 
 * Runtime utilities for resolving token references to values.
 * Used when CSS variables are not available or for server-side rendering.
 */

// =============================================================================
// TYPES
// =============================================================================

export type TokenCategory = 
  | 'color'
  | 'typography'
  | 'space'
  | 'radius'
  | 'effect'
  | 'layout';

export interface TokenReference {
  category: TokenCategory;
  name: string;
  variant?: string;
  mode?: 'light' | 'dark';
}

export interface ResolvedToken {
  cssVariable: string;
  value: string | number;
  reference: TokenReference;
}

// =============================================================================
// TOKEN RESOLUTION
// =============================================================================

/**
 * Parse a token reference string into structured format
 * 
 * Examples:
 * - "color.bg.base" → { category: "color", name: "bg-base" }
 * - "space.inset.m" → { category: "space", name: "inset-m" }
 * - "effect.elevation.2" → { category: "effect", name: "elevation-2" }
 */
export function parseTokenReference(ref: string): TokenReference | null {
  const parts = ref.split('.');
  
  if (parts.length < 2) return null;
  
  const category = parts[0] as TokenCategory;
  const name = parts.slice(1).join('-');
  
  return { category, name };
}

/**
 * Get CSS variable name for a token reference
 */
export function getCSSVariableName(ref: TokenReference): string {
  return `--${ref.category}-${ref.name}`;
}

/**
 * Get CSS variable reference string.
 * Supports an optional fallback value for graceful degradation when the
 * token is not yet defined or when partial specs reference unknown tokens.
 */
export function getCSSVariableRef(ref: TokenReference, fallback?: string): string {
  if (fallback !== undefined) {
    return `var(${getCSSVariableName(ref)}, ${fallback})`;
  }
  return `var(${getCSSVariableName(ref)})`;
}

/**
 * Resolve a token reference to its CSS variable and computed value.
 * Returns a result with the fallback value if the token is not found
 * (graceful degradation) instead of returning null.
 */
export function resolveToken(
  ref: TokenReference,
  tokenValues: Record<string, Record<string, string | number>>,
  fallback?: string | number
): ResolvedToken | null {
  const categoryTokens = tokenValues[ref.category];
  const value = categoryTokens?.[ref.name];

  if (value !== undefined) {
    return {
      cssVariable: getCSSVariableName(ref),
      value,
      reference: ref,
    };
  }

  // Graceful degradation: return fallback if provided
  if (fallback !== undefined) {
    return {
      cssVariable: getCSSVariableName(ref),
      value: fallback,
      reference: ref,
    };
  }

  return null;
}

// =============================================================================
// BATCH RESOLUTION
// =============================================================================

/**
 * Resolve multiple token references at once
 */
export function resolveTokens(
  refs: (string | TokenReference)[],
  tokenValues: Record<string, Record<string, string | number>>
): Map<string, ResolvedToken> {
  const results = new Map<string, ResolvedToken>();
  
  for (const ref of refs) {
    const parsed = typeof ref === 'string' ? parseTokenReference(ref) : ref;
    if (!parsed) continue;
    
    const resolved = resolveToken(parsed, tokenValues);
    if (resolved) {
      const key = typeof ref === 'string' ? ref : `${ref.category}.${ref.name}`;
      results.set(key, resolved);
    }
  }
  
  return results;
}

// =============================================================================
// RUNTIME VALUE ACCESS
// =============================================================================

/**
 * Get computed CSS variable value from the DOM
 */
export function getComputedTokenValue(ref: TokenReference): string | null {
  if (typeof window === 'undefined') return null;
  
  const varName = getCSSVariableName(ref);
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || null;
}

/**
 * Set CSS variable value at runtime
 */
export function setTokenValue(ref: TokenReference, value: string): void {
  if (typeof window === 'undefined') return;
  
  const varName = getCSSVariableName(ref);
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Remove runtime token override
 */
export function clearTokenOverride(ref: TokenReference): void {
  if (typeof window === 'undefined') return;
  
  const varName = getCSSVariableName(ref);
  document.documentElement.style.removeProperty(varName);
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get current theme mode
 */
export function getCurrentTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null;
  
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light' || theme === 'dark') return theme;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Set theme mode
 */
export function setTheme(mode: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', mode);
}

/**
 * Toggle theme mode
 */
export function toggleTheme(): 'light' | 'dark' {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Check if a token reference is valid
 */
export function isValidTokenReference(ref: string | TokenReference): boolean {
  const parsed = typeof ref === 'string' ? parseTokenReference(ref) : ref;
  if (!parsed) return false;
  
  const validCategories: TokenCategory[] = [
    'color', 'typography', 'space', 'radius', 'effect', 'layout'
  ];
  
  return validCategories.includes(parsed.category);
}

/**
 * Check if a CSS variable exists
 */
export function tokenExists(ref: TokenReference): boolean {
  return getComputedTokenValue(ref) !== null;
}
