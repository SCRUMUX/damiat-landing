const path = require('path');
const createStorybookTailwindConfig = require('../../storybook/tailwind.config.cjs');

const consumerRoot = path.resolve(__dirname);
const config = createStorybookTailwindConfig(consumerRoot);

// Monorepo: App imports blocks from repo root — ensure Tailwind scans them.
const coreRoot = path.resolve(consumerRoot, '../..');
config.content.files.push(
  path.join(coreRoot, 'blocks/**/*.{js,ts,jsx,tsx}'),
  path.join(coreRoot, 'components/**/*.{js,ts,jsx,tsx}'),
  path.join(coreRoot, 'hooks/**/*.{js,ts,jsx,tsx}'),
  path.join(coreRoot, 'layout/**/*.{js,ts,jsx,tsx}'),
);

module.exports = config;