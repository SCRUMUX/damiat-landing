const path = require('path');

const coreConfig = require('@ai-ds/core/tailwind');
const siteDir = __dirname;
const productRoot = path.join(siteDir, 'product');

module.exports = {
  ...coreConfig,
  content: {
    relative: false,
    files: [
      ...coreConfig.content.files,
      path.join(siteDir, 'index.html'),
      path.join(siteDir, 'src/**/*.{ts,tsx,html}'),
      path.join(productRoot, 'blocks/**/*.{ts,tsx}'),
      path.join(productRoot, 'hooks/**/*.{ts,tsx}'),
    ],
  },
};
