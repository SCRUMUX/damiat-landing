/**
 * no-size-in-find-classes — AICADS assembly ESLint rule.
 *
 * Forbids passing `size` into findClasses() / findRuleClasses() in primitives.
 * Size/layout belongs in SIZE_CLASSES; semantic axes only in findClasses.
 *
 * See .cursor/rules/aicads-assembly.mdc invariant #2.
 */

'use strict';

const CALLEE_NAMES = new Set(['findClasses', 'findRuleClasses']);

function objectHasSizeKey(node) {
  if (!node || node.type !== 'ObjectExpression') return false;
  return node.properties.some((prop) => {
    if (prop.type !== 'Property') return false;
    if (prop.key.type === 'Identifier') return prop.key.name === 'size';
    if (prop.key.type === 'Literal') return prop.key.value === 'size';
    return false;
  });
}

function getVariantArgsObject(args) {
  if (args.length === 0) return null;
  if (args.length >= 2) return args[1];
  if (args[0]?.type === 'ObjectExpression') return args[0];
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow `size` in findClasses() — use SIZE_CLASSES for layout (see aicads-assembly.mdc).',
    },
    messages: {
      noSizeInFindClasses:
        'Do not pass `size` to findClasses(). Use SIZE_CLASSES for layout/typography and findClasses for semantic axes only (.cursor/rules/aicads-assembly.mdc).',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/');
    if (!filename.includes('components/primitives/')) return {};
    if (/\.stories\.(tsx?|jsx?)$/.test(filename)) return {};

    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== 'Identifier' || !CALLEE_NAMES.has(callee.name)) return;

        const variantArgs = getVariantArgsObject(node.arguments);
        if (!objectHasSizeKey(variantArgs)) return;

        context.report({
          node: variantArgs,
          messageId: 'noSizeInFindClasses',
        });
      },
    };
  },
};
