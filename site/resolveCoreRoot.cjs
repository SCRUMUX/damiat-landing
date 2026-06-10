const fs = require('fs');
const path = require('path');

/** @param {string} siteDir */
function resolveCoreRoot(siteDir) {
  const bundledCore = path.resolve(siteDir, '../core');

  if (process.env.VERCEL || process.env.CI) {
    return bundledCore;
  }

  const siblingSource = path.resolve(siteDir, '../../DAMIAT');

  if (fs.existsSync(path.join(siblingSource, 'config/tailwind/tailwind.config.cjs'))) {
    return siblingSource;
  }

  return bundledCore;
}

module.exports = { resolveCoreRoot };
