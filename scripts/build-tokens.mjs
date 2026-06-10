#!/usr/bin/env node
/**
 * Generate config/css-variables/tokens.css from ai-ds-spec.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SPEC_PATH = path.join(ROOT, 'ai-ds-spec.json');
const OUT_PATH = path.join(ROOT, 'config/css-variables/tokens.css');

const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
const tokens = spec.tokens ?? spec.designTokens ?? spec;

function toCssName(tokenKey) {
  return `--${tokenKey.replace(/_/g, '-')}`;
}

function sortKeys(obj) {
  return Object.keys(obj).sort((a, b) => a.localeCompare(b));
}

function resolveColorRef(primitives, ref) {
  if (ref.startsWith('#')) return ref;
  return primitives[ref] ?? ref;
}

function collectSemanticColors(colorSection) {
  const out = { light: {}, dark: {} };
  for (const [groupName, group] of Object.entries(colorSection)) {
    if (groupName === 'primitives' || typeof group !== 'object') continue;
    for (const [key, modes] of Object.entries(group)) {
      if (!modes || typeof modes !== 'object' || !('light' in modes)) continue;
      out.light[key] = modes.light;
      out.dark[key] = modes.dark;
    }
  }
  return out;
}

function shadowLayer(layer) {
  const alpha = (layer.opacity ?? 100) / 100;
  const color = layer.color ?? '#000000';
  if (layer.colorToken) {
    const cssVar = toCssName(layer.colorToken);
    if (layer.colorToken === 'color_brand_primary' && layer.opacity === 35) {
      return `0px ${layer.y}px ${layer.blur}px ${layer.spread}px color-mix(in srgb, var(${cssVar}) 35%, transparent)`;
    }
    return `0px ${layer.y}px ${layer.blur}px ${layer.spread}px var(${cssVar})`;
  }
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `0px ${layer.y}px ${layer.blur}px ${layer.spread}px rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadowsToCss(layers) {
  return layers.map(shadowLayer).join(', ');
}

function emitBlock(lines, indent, entries) {
  for (const key of sortKeys(entries)) {
    lines.push(`${indent}${toCssName(key)}: ${entries[key]};`);
  }
}

const color = tokens.color;
const primitives = color.primitives;
const semantic = collectSemanticColors(color);

const lines = [];
lines.push('/**');
lines.push(' * DESIGN TOKENS - CSS CUSTOM PROPERTIES');
lines.push(' * AUTO-GENERATED FROM ai-ds-spec.json');
lines.push(' * DO NOT EDIT MANUALLY. Run: npm run tokens:build');
lines.push(' */');
lines.push('');

// :root block
lines.push(':root {');

lines.push('  /* Color primitives */');
for (const key of sortKeys(primitives)) {
  lines.push(`  ${toCssName(key)}: ${primitives[key]};`);
}

lines.push('');
lines.push('  /* Space primitives */');
for (const key of sortKeys(tokens.space.primitives)) {
  lines.push(`  ${toCssName(key)}: ${tokens.space.primitives[key]}px;`);
}

lines.push('');
lines.push('  /* Breakpoint primitives — exposed as tokens so layout primitives reference');
lines.push('     them through `var(--breakpoint-*)` instead of hardcoding pixel values. */');
lines.push('  --breakpoint-mobile-max: 767px;');
lines.push('  --breakpoint-tablet-max: 1439px;');
lines.push('  --breakpoint-desktop:    1440px;');

lines.push('');
lines.push('  /* Space semantic */');
for (const key of sortKeys(tokens.space.semantic)) {
  const ref = tokens.space.semantic[key];
  lines.push(`  ${toCssName(key)}: var(${toCssName(ref)});`);
}

lines.push('');
lines.push('  /* Radius primitives */');
const radiusPrimitives = { ...tokens.radius.primitives };
for (const key of sortKeys(radiusPrimitives)) {
  const val = radiusPrimitives[key];
  lines.push(`  ${toCssName(key)}: ${val === 'full' || val === 9999 ? '9999px' : `${val}px`};`);
}

lines.push('');
lines.push('  /* Radius semantic */');
const radiusSemantic = {
  ...tokens.radius.semantic,
  radius_md_plus: 'radius_20',
};
for (const key of sortKeys(radiusSemantic)) {
  const ref = radiusSemantic[key];
  lines.push(`  ${toCssName(key)}: var(${toCssName(ref)});`);
}

lines.push('');
lines.push('  /* Border width */');
for (const key of sortKeys(tokens.borderWidth)) {
  lines.push(`  ${toCssName(key)}: ${tokens.borderWidth[key]}px;`);
}

lines.push('');
lines.push('  /* Ratio (aspect ratios) */');
for (const key of sortKeys(tokens.ratio)) {
  lines.push(`  ${toCssName(key)}: ${tokens.ratio[key]};`);
}

lines.push('');
lines.push('  /* Typography — DIAMAT scale (see docs/diamat-design-system.md) */');
lines.push("  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;");
lines.push("  --font-family-alt: 'Manrope', 'Inter', sans-serif;");
lines.push("  --font-family-mono: 'Roboto Mono', 'SF Mono', 'Monaco', monospace;");
const fontSizes = { 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20, 24: 24, 28: 28, 32: 32, 36: 36, 48: 48 };
for (const [k, v] of Object.entries(fontSizes)) {
  lines.push(`  --font-size-${k}: ${v}px;`);
}
const lineHeights = { 12: 12, 16: 16, 20: 20, 24: 24, 28: 28, 32: 32, 36: 36, 40: 40, 44: 44, 56: 56 };
for (const [k, v] of Object.entries(lineHeights)) {
  lines.push(`  --line-height-${k}: ${v}px;`);
}
lines.push('  --font-weight-regular: 400;');
lines.push('  --font-weight-medium: 500;');
lines.push('  --font-weight-semibold: 600;');
lines.push('  --font-feature-tabular: "tnum" on, "lnum" on;');

lines.push('');
lines.push('  /* Layout / Grid */');
const layout = tokens.layout;
for (const bp of ['desktop', 'tablet', 'mobile']) {
  const g = layout[bp];
  lines.push(`  --grid-${bp}-columns: ${g.columns};`);
  lines.push(`  --grid-${bp}-gutter: ${g.gutterSize}px;`);
  lines.push(`  --grid-${bp}-offset: ${g.offset}px;`);
  lines.push(`  --grid-${bp}-breakpoint: ${g.breakpoint.min}px;`);
}

lines.push('');
lines.push('  /* Z-index scale */');
lines.push('  --z-header: 30;');
lines.push('  --z-popover: 40;');
lines.push('  --z-modal: 50;');
lines.push('  --z-tooltip: 60;');
lines.push('  --z-toast: 70;');

lines.push('');
lines.push('  /* Effect / opacity */');
lines.push(`  --opacity-disabled: ${(tokens.effect.opacity_disabled ?? 50) / 100};`);
lines.push('}');
lines.push('');

function emitThemeBlock(selector, mode, includeEffects, effectMode = 'light') {
  lines.push(selector);
  const entries = {};
  for (const key of sortKeys(semantic.light)) {
    const ref = semantic[mode][key];
    entries[key] = resolveColorRef(primitives, ref);
  }
  emitBlock(lines, '  ', Object.fromEntries(
    sortKeys(entries).map((k) => [k, entries[k]]),
  ));

  if (includeEffects) {
    lines.push('');
    lines.push(`  /* ${effectMode === 'light' ? 'Effect' : 'Dark effect'} tokens */`);
    const effect = tokens.effect;
    const darkMultipliers = effectMode === 'dark'
      ? { 12: 24, 8: 16, 14: 28, 10: 20, 30: 45, 45: 67.5 }
      : null;

    const effectKeys = [
      'effect_elevation_1',
      'effect_elevation_2',
      'effect_elevation_3',
      'effect_elevation_glow',
      'effect_focus_brand',
      'effect_focus_danger',
      'effect_focus_success',
      'effect_focus_warning',
      'effect_scrim_light',
      'effect_scrim_strong',
    ];

    for (const ek of effectKeys) {
      const val = effect[ek];
      if (Array.isArray(val)) {
        if (darkMultipliers && !ek.includes('focus') && !ek.includes('glow')) {
          const adjusted = val.map((layer) => ({
            ...layer,
            opacity: darkMultipliers[layer.opacity] ?? layer.opacity * 2,
          }));
          lines.push(`  ${toCssName(ek)}: ${shadowsToCss(adjusted)};`);
        } else if (ek === 'effect_scrim_strong' && effectMode === 'dark') {
          lines.push(`  ${toCssName(ek)}: rgba(0, 0, 0, 0.675);`);
        } else if (ek === 'effect_scrim_light' && effectMode === 'dark') {
          lines.push(`  ${toCssName(ek)}: rgba(0, 0, 0, 0.45);`);
        } else {
          lines.push(`  ${toCssName(ek)}: ${shadowsToCss(val)};`);
        }
      }
    }

    if (effectMode === 'light') {
      lines.push(`  ${toCssName('effect_blur_background')}: ${effect.effect_blur_background?.backdropBlur ?? 12}px;`);

      lines.push('');
      lines.push('  /* DAMIAT Color System aliases (etc/damiat-tokens.json) */');
      const damiatAliases = [
        ['bg-primary', 'color-bg-base'],
        ['bg-secondary', 'color-bg-muted'],
        ['surface', 'color-surface-1'],
        ['surface-muted', 'color-surface-2'],
        ['text-primary', 'color-text-primary'],
        ['text-secondary', 'color-text-secondary'],
        ['text-muted', 'color-text-muted'],
        ['green-900', 'core-green-900'],
        ['green-800', 'core-green-800'],
        ['green-700', 'core-green-700'],
        ['green-primary', 'color-brand-primary'],
        ['green-accent', 'color-brand-hover'],
        ['green-soft', 'color-brand-muted'],
        ['accent-primary', 'color-brand-primary'],
        ['accent-secondary', 'color-brand-hover'],
        ['accent-soft', 'color-brand-muted'],
        ['data-900', 'core-data-900'],
        ['data-800', 'core-data-800'],
        ['data-700', 'core-data-700'],
        ['border', 'color-border-base'],
        ['divider', 'color-divider'],
        ['success', 'color-success-base'],
        ['warning', 'color-warning-base'],
        ['danger', 'color-danger-base'],
        ['deep-navy-900', 'core-data-900'],
        ['deep-navy-800', 'core-data-800'],
        ['deep-navy-700', 'core-data-700'],
        ['radius-sm', 'radius-subtle'],
        ['radius-md', 'radius-medium'],
        ['radius-lg', 'radius-xl'],
        ['radius-xl', 'radius-2xl'],
        ['shadow-sm', 'effect-elevation-1'],
        ['shadow-md', 'effect-elevation-2'],
        ['shadow-lg', 'effect-elevation-3'],
      ];
      for (const [alias, target] of damiatAliases) {
        lines.push(`  --${alias}: var(--${target});`);
      }

      const glassChrome = effect.effect_glass_chrome;
      if (glassChrome?.backgroundFillToken) {
        const opacity = glassChrome.backgroundOpacity ?? 95;
        lines.push(
          `  ${toCssName('effect_glass_chrome_bg')}: color-mix(in srgb, var(${toCssName(glassChrome.backgroundFillToken)}) ${opacity}%, transparent);`,
        );
      }

      const glassScrim = effect.effect_glass_scrim ?? effect.effect_blur_background;
      if (glassScrim) {
        const fill = glassScrim.backgroundFill ?? '#FFFFFF';
        const opacity = glassScrim.backgroundOpacity ?? 20;
        lines.push(
          `  ${toCssName('effect_glass_scrim_bg')}: color-mix(in srgb, ${fill} ${opacity}%, transparent);`,
        );
      }
    }

    lines.push('');
    lines.push('  --color-surface-hover: var(--color-surface-3);');
    lines.push('  --color-surface-active: var(--color-surface-3);');
  }

  lines.push('}');
  lines.push('');
}

emitThemeBlock(':root,\n[data-theme="light"] {', 'light', true, 'light');
emitThemeBlock('[data-theme="dark"] {', 'dark', true, 'dark');

lines.push('@media (prefers-color-scheme: dark) {');
lines.push('  :root:not([data-theme="light"]) {');
const darkEntries = {};
for (const key of sortKeys(semantic.dark)) {
  darkEntries[key] = resolveColorRef(primitives, semantic.dark[key]);
}
emitBlock(lines, '    ', darkEntries);
lines.push('  }');
lines.push('}');
lines.push('');

fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf8');
console.log(`[tokens:build] Wrote ${OUT_PATH}`);
