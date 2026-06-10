const path = require('path');
const createStorybookTailwindConfig = require('../storybook/tailwind.config.cjs');

module.exports = createStorybookTailwindConfig(path.resolve(__dirname));
