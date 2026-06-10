import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMainConfig } from '../../storybook/createMainConfig';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(storybookDir, '..');

const config = createMainConfig({
  mode: 'monorepo',
  storybookDir,
  projectRoot,
  generatedIconsDir: path.resolve(storybookDir, '../../generated-icons'),
});

export default config;
