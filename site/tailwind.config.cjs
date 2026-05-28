const path = require('path');

const coreConfig = require('../core/config/tailwind/tailwind.config.cjs');

module.exports = {
  ...coreConfig,
  content: {
    relative: false,
    files: [
      ...coreConfig.content.files,
      path.join(__dirname, 'index.html'),
      path.join(__dirname, 'src/**/*.{ts,tsx,html}'),
    ],
  },
};
