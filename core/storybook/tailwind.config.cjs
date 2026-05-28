const path = require('path');

/** Resolve @ai-ds/core package root from the consumer project root. */
function resolveCoreRoot(projectRoot) {
  try {
    return path.dirname(require.resolve('@ai-ds/core/package.json', { paths: [projectRoot] }));
  } catch {
    // Monorepo fallback when running from AICADS repo without npm link
    return path.resolve(__dirname, '..');
  }
}

module.exports = function createStorybookTailwindConfig(projectRoot = process.cwd()) {
  const coreRoot = resolveCoreRoot(projectRoot);
  const coreConfig = require(path.join(coreRoot, 'config/tailwind/tailwind.config.cjs'));

  return {
    ...coreConfig,
    content: {
      relative: false,
      files: [
        ...coreConfig.content.files,
        path.join(projectRoot, 'src/**/*.{ts,tsx,html}'),
        path.join(projectRoot, '.storybook/**/*.{ts,tsx}'),
      ],
    },
  };
};

/** Default export for `tailwind.config.cjs` in consumer projects. */
module.exports.default = module.exports(process.cwd());
