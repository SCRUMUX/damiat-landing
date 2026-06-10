import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getSessionPaths, getGeneratedIconsRoot } from '../paths.js';
import { resetSynaptikConfigCache } from '../synaptik-config.js';
import { deleteSession } from './delete-session.js';

test('deleteSession removes session dir but not generated-icons project folder', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-del-'));
  process.env.SYNAPTIK_ICONS_DIR = path.join(tmp, 'generated-icons');
  resetSynaptikConfigCache();

  const sessionId = 'del12345';
  const paths = getSessionPaths(sessionId);
  fs.mkdirSync(paths.sessionDir, { recursive: true });
  fs.writeFileSync(path.join(paths.sessionDir, 'marker.txt'), 'x');

  const catalogRoot = getGeneratedIconsRoot();
  const projectDir = path.join(catalogRoot, 'test-delete-project');
  const iconDir = path.join(projectDir, 'sample-icon');
  fs.mkdirSync(iconDir, { recursive: true });
  fs.writeFileSync(path.join(iconDir, 'keep.txt'), 'catalog');

  deleteSession(sessionId);

  assert.equal(fs.existsSync(paths.sessionDir), false);
  assert.equal(fs.existsSync(path.join(iconDir, 'keep.txt')), true);

  fs.rmSync(tmp, { recursive: true, force: true });
  delete process.env.SYNAPTIK_ICONS_DIR;
  resetSynaptikConfigCache();
});
