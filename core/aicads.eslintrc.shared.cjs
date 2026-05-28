/**
 * AICADS shareable ESLint config for **consumer projects**.
 *
 * Drop-in usage in a consumer repository:
 *
 *   // .eslintrc.cjs
 *   module.exports = {
 *     extends: [require.resolve('@ai-ds/core/eslint-config')],
 *   };
 *
 * (Or: `extends: ['./node_modules/@ai-ds/core/aicads.eslintrc.shared.cjs']`.)
 *
 * What it enforces:
 *   - You may NOT directly import any behavior engine that AICADS already
 *     wraps (Radix, cmdk, vaul, sonner, Floating UI, input-otp,
 *     class-variance-authority). Use the AICADS semantic surface instead
 *     (`@ai-ds/core/components`, `@ai-ds/core/hooks`, etc.).
 *
 * Why:
 *   - Bypassing the AICADS surface defeats the isolation contract (see
 *     [components/primitives/_internal/README.md]) and breaks the design
 *     system's ability to swap engines without consumer churn.
 *
 * Exception:
 *   - This rule does NOT apply inside `node_modules/@ai-ds/core/**` — the
 *     design system itself is the only legitimate place to touch the
 *     underlying engines (and only from `components/primitives/_internal/`).
 */

const BEHAVIOR_ENGINE_PATTERNS = [
  '@radix-ui/*',
  'cmdk',
  'vaul',
  'sonner',
  '@floating-ui/*',
  'input-otp',
  'class-variance-authority',
];

const MESSAGE =
  'Direct import of an AICADS behavior engine is forbidden in consumer ' +
  'code. Use the AICADS semantic API instead (e.g. `@ai-ds/core/components`, ' +
  '`@ai-ds/core/hooks`, `@ai-ds/core/behaviors`). The isolation contract is ' +
  'documented in components/primitives/_internal/README.md.';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: BEHAVIOR_ENGINE_PATTERNS.map((pattern) => ({
          group: [pattern],
          message: MESSAGE,
        })),
      },
    ],
  },
  overrides: [
    {
      // AICADS itself is exempt — its `_internal/` adapters are the only
      // legitimate consumers of the engines listed above.
      files: ['**/node_modules/@ai-ds/core/**'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
