/**
 * AICADS @ai-ds/core — ESLint rules.
 *
 * The repo is **source-distributed**: no build step, consumers compile the
 * TypeScript directly. We do not ship a full lint pipeline here; this config
 * exists primarily to enforce the architectural isolation contract between
 * AICADS primitives and their internal behavior substrate (Radix / cmdk /
 * Floating UI / sonner / vaul / cva).
 *
 * See [components/primitives/_internal/README.md](./components/primitives/_internal/README.md)
 * for the rationale.
 */

/** Behavior libraries that are allowed ONLY inside _internal/. */
const RESTRICTED_INTERNAL_ONLY = [
  '@radix-ui/*',
  'cmdk',
  '@floating-ui/*',
  'sonner',
  'vaul',
  'class-variance-authority',
  'input-otp',
];

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'storybook-static/',
    'figma-plugin/figma-ai-ds-code.js',
    // Synaptik has its own lint script (`npm run synaptik:ui:lint`) with rulesdir;
    // nested .eslintrc extends @ai-ds/core/eslint-config which is not resolvable in CI.
    'modules/synaptik-icon-builder/',
    'templates/',
  ],
  rules: {
    // Default: behavior libs are forbidden everywhere.
    'no-restricted-imports': [
      'error',
      {
        patterns: RESTRICTED_INTERNAL_ONLY.map((pattern) => ({
          group: [pattern],
          message:
            'Import via components/primitives/_internal/ instead. ' +
            'See components/primitives/_internal/README.md for the isolation contract.',
        })),
      },
    ],

    // AICADS token enforcement layer. Loaded from `eslint-rules/` via the
    // `--rulesdir` flag in `npm run lint`. Forbids hardcoded spacing /
    // radius / colour values in primitives. See ./eslint-rules/README.md.
    'no-hardcoded-tokens': 'error',
    'no-size-in-find-classes': 'error',
  },
  overrides: [
    {
      // _internal/ is the ONLY place where these libraries may be imported.
      files: ['components/primitives/_internal/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      // Storybook stories may need to import for setup decorators, etc.
      // We still keep the rule on, but loosen the message tone for stories.
      files: ['**/*.stories.{ts,tsx}'],
      rules: {
        'no-hardcoded-tokens': 'off',
      },
    },
    {
      // Marketing blocks — same token enforcement as primitives (Phase 3 complete).
      files: ['blocks/**/*.{ts,tsx}'],
      excludedFiles: [
        '**/*.stories.{ts,tsx}',
        'blocks/marketing/demo-assets/**',
      ],
      rules: {
        'no-hardcoded-tokens': 'error',
      },
    },
    {
      // Storybook kit loads engine CSS via Vite aliases — not consumer-facing imports.
      files: ['storybook/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
