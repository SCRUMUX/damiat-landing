const path = require('path');



const { resolveCoreRoot } = require('./resolveCoreRoot.cjs');



const siteDir = __dirname;

const coreRoot = resolveCoreRoot(siteDir);

const coreConfig = require(path.join(coreRoot, 'config/tailwind/tailwind.config.cjs'));



module.exports = {

  ...coreConfig,

  content: {

    relative: false,

    files: [

      ...coreConfig.content.files,

      path.join(siteDir, 'index.html'),

      path.join(siteDir, 'src/**/*.{ts,tsx,html}'),

    ],

  },

};

