const path = require('path');

function loadTailwindFactory() {
  try {
    return require(require.resolve('@ai-ds/core/storybook/tailwind', {
      paths: [__dirname],
    }));
  } catch {
    return require(path.join(__dirname, '../../../storybook/tailwind.config.cjs'));
  }
}

const createStorybookTailwindConfig = loadTailwindFactory();
module.exports = createStorybookTailwindConfig(__dirname);
