import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { writeJsonFile } from '../fs-json.js';
import { getGeneratedIconsRoot } from '../paths.js';
import { resetSynaptikConfigCache } from '../synaptik-config.js';
import { pruneOrphanGeneratedIconProjects } from './publish.js';
import { AssetMetaSchema } from '../types/index.js';

test('pruneOrphanGeneratedIconProjects keeps folder with published PNG when not in registry', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-prune-'));
  process.env.SYNAPTIK_ICONS_DIR = path.join(tmp, 'generated-icons');
  resetSynaptikConfigCache();

  const root = getGeneratedIconsRoot();
  const projectDir = path.join(root, 'orphan-project');
  const iconDir = path.join(projectDir, 'my-icon');
  fs.mkdirSync(iconDir, { recursive: true });
  fs.writeFileSync(path.join(iconDir, 'icon.png'), 'png');
  fs.writeFileSync(path.join(iconDir, 'icon.webp'), 'webp');
  writeJsonFile(
    path.join(iconDir, 'meta.json'),
    AssetMetaSchema.parse({
      name: 'MyIcon',
      category: 'T',
      style: 's',
      createdBy: 't',
      publishedAt: new Date().toISOString(),
    }),
  );

  pruneOrphanGeneratedIconProjects([]);

  assert.equal(fs.existsSync(iconDir), true);

  delete process.env.SYNAPTIK_ICONS_DIR;
  resetSynaptikConfigCache();
});
