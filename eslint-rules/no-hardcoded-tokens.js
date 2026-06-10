/**
 * no-hardcoded-tokens — AICADS local ESLint rule.
 *
 * Forbids structural values that should come from design tokens:
 *   1. JSX `style={{ padding|margin|gap|... : <number or '<n>px'> }}`
 *      where the value is not `var(--*)`, `0`, `auto`, `<n>%`, or `calc(... var(--*) ...)`.
 *   2. Tailwind arbitrary values like `p-[8px]`, `gap-[6px]`, `rounded-[4px]`
 *      where the bracketed inner is a raw number/px/rem, not `var(--*)`.
 *   3. Hex / rgb() color literals (`#fff`, `#1A2330`, `rgb(...)`, `rgba(...)`) —
 *      every colour must come from `var(--color-*)`.
 *
 * Files skipped:
 *   - `*.stories.tsx` / `*.stories.ts` — Storybook demos may show raw colours
 *     as labels; these are policed separately by 10.8.
 *   - `scripts/**`, `node_modules/**`.
 *   - `blocks/marketing/demo-assets/**` — SVG placeholder literals.
 *
 * Files INCLUDED:
 *   - `components/primitives/**` (including `_shared/` and `_internal/`).
 *   - `blocks/**` (marketing blocks and shared layout helpers).
 */

'use strict';

const SPACING_PROPS = new Set([
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'paddingX', 'paddingY', 'paddingInline', 'paddingBlock',
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'marginX', 'marginY', 'marginInline', 'marginBlock',
  'gap', 'rowGap', 'columnGap',
  'fontSize', 'lineHeight',
  'borderRadius', 'borderWidth',
  'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  // We intentionally do NOT include `width` and `height` plain props because
  // skeletons and other primitives pass computed pixel widths to layout-shape
  // children (e.g. SkeletonBlock width=168). Those are content shape data,
  // not spacing.
]);

const TAILWIND_TOKEN_CLASSES = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'gap', 'gap-x', 'gap-y',
  'w', 'h', 'min-w', 'min-h', 'max-w', 'max-h',
  'text', 'leading', 'rounded',
  'border-w',
].join('|');
const TAILWIND_ARBITRARY_RE = new RegExp(
  `\\b(?:${TAILWIND_TOKEN_CLASSES})-\\[([^\\]]+)\\]`,
  'g',
);

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;
const RGB_COLOR_RE = /\brgba?\s*\(/;

function isAllowedStringValue(value) {
  if (/^var\(--/.test(value)) return true;
  if (/^\d+(\.\d+)?%$/.test(value)) return true;
  if (/^(auto|inherit|initial|unset|revert|none|transparent|currentColor)$/.test(value)) return true;
  if (/^0(?:px|rem|em)?$/.test(value)) return true;
  if (/^calc\(.*var\(--/.test(value)) return true;
  return false;
}

function isHardcodedPixelString(value) {
  if (typeof value !== 'string') return false;
  if (isAllowedStringValue(value)) return false;
  return /\d+(?:\.\d+)?(?:px|rem|em)?/.test(value);
}

function normalizePath(filename) {
  return filename.replace(/\\/g, '/');
}

function isStoryOrSkippedFile(filename) {
  const f = normalizePath(filename);
  return (
    /\.stories\.(t|j)sx?$/.test(f) ||
    /\/(scripts|node_modules|dist|storybook-static|playground\/\.storybook)\//.test(f) ||
    /\/blocks\/marketing\/demo-assets\//.test(f)
  );
}

function isLintTarget(filename) {
  const f = normalizePath(filename);
  return (
    /\/components\/primitives\//.test(f) ||
    /\/blocks\//.test(f)
  );
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'AICADS: forbid hardcoded spacing/radius/colour values; require design tokens.',
    },
    schema: [],
    messages: {
      hardcodedStyleNumber:
        'style.{{prop}} = {{value}} is a hardcoded number. Use a `var(--space-*)` token via Tailwind arbitrary class instead (e.g. `p-[var(--space-{{value}})]`).',
      hardcodedStyleString:
        'style.{{prop}} = "{{value}}" is a hardcoded value. Use `var(--space-*)` / `var(--radius-*)` instead.',
      hardcodedTailwind:
        'Tailwind arbitrary value `{{value}}` contains a raw number. Replace with `var(--space-*)` / `var(--radius-*)` / `var(--size-*)`.',
      hardcodedHex:
        'Hex colour literal `{{value}}` is forbidden in primitives. Use `var(--color-*)` instead.',
      hardcodedRgb:
        'rgb()/rgba() colour literal in `{{value}}` is forbidden in primitives. Use `var(--color-*)` (with optional `var(--opacity-*)`) instead.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    if (isStoryOrSkippedFile(filename)) return {};
    if (!isLintTarget(filename)) return {};

    return {
      // 1. Inline style={{ ... }}
      JSXAttribute(node) {
        if (!node.name || node.name.name !== 'style') return;
        if (!node.value || node.value.type !== 'JSXExpressionContainer') return;
        const expr = node.value.expression;
        if (!expr || expr.type !== 'ObjectExpression') return;
        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue;
          if (prop.computed) continue;
          const key =
            (prop.key.type === 'Identifier' && prop.key.name) ||
            (prop.key.type === 'Literal' && prop.key.value);
          if (!key || !SPACING_PROPS.has(key)) continue;
          const v = prop.value;
          if (v.type !== 'Literal') continue;
          if (typeof v.value === 'number') {
            if (v.value === 0) continue;
            context.report({
              node: v,
              messageId: 'hardcodedStyleNumber',
              data: { prop: key, value: String(v.value) },
            });
          } else if (typeof v.value === 'string') {
            if (isHardcodedPixelString(v.value)) {
              context.report({
                node: v,
                messageId: 'hardcodedStyleString',
                data: { prop: key, value: v.value },
              });
            }
          }
        }
      },
      // 2. Tailwind arbitrary values + 3. hex / rgb()
      Literal(node) {
        if (typeof node.value !== 'string') return;
        const v = node.value;

        // Tailwind arbitrary inside class strings.
        TAILWIND_ARBITRARY_RE.lastIndex = 0;
        let m;
        while ((m = TAILWIND_ARBITRARY_RE.exec(v)) !== null) {
          const inside = m[1];
          if (/var\(--/.test(inside)) continue;
          if (/^\d+(\.\d+)?%$/.test(inside)) continue;
          if (/^calc\(/.test(inside)) continue;
          // Allow common non-token values that are layout primitives, not spacing.
          if (/^(full|screen|min|max|fit|auto|0)$/.test(inside)) continue;
          // Viewport units are responsive primitives, not raw pixel values.
          if (/^\d+(\.\d+)?(?:vh|vw|vmin|vmax)$/.test(inside)) continue;
          if (/^\d+(?:\.\d+)?(?:px|rem|em|ch|fr)$|^\d+$/.test(inside)) {
            context.report({
              node,
              messageId: 'hardcodedTailwind',
              data: { value: m[0] },
            });
          }
        }

        if (HEX_COLOR_RE.test(v)) {
          context.report({
            node,
            messageId: 'hardcodedHex',
            data: { value: v },
          });
        } else if (RGB_COLOR_RE.test(v) && !/var\(--/.test(v)) {
          context.report({
            node,
            messageId: 'hardcodedRgb',
            data: { value: v },
          });
        }
      },
    };
  },
};
