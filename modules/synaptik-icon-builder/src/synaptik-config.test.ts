import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  loadSynaptikConfig,
  resolveGeneratedIconsRoot,
  resetSynaptikConfigCache,
} from './synaptik-config.js';
import { resetWorkspaceRootCache } from './workspace-root.js';

describe('synaptik-config', () => {
  let tmp: string;
  let prevCwd: string;
  let prevEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-cfg-'));
    prevCwd = process.cwd();
    prevEnv = { ...process.env };
    process.chdir(tmp);
    fs.writeFileSync(path.join(tmp, 'package.json'), '{"name":"demo-app"}', 'utf8');
    resetWorkspaceRootCache();
    resetSynaptikConfigCache();
  });

  afterEach(() => {
    process.chdir(prevCwd);
    process.env = prevEnv;
    resetWorkspaceRootCache();
    resetSynaptikConfigCache();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('defaults outputDir to generated-icons under workspace', () => {
    const root = resolveGeneratedIconsRoot();
    assert.equal(root, path.join(tmp, 'generated-icons'));
  });

  it('reads synaptik.config.json outputDir', () => {
    fs.writeFileSync(
      path.join(tmp, 'synaptik.config.json'),
      JSON.stringify({ outputDir: 'src/assets/icons' }),
      'utf8',
    );
    resetSynaptikConfigCache();
    assert.equal(resolveGeneratedIconsRoot(), path.join(tmp, 'src/assets/icons'));
  });

  it('SYNAPTIK_ICONS_DIR overrides config file', () => {
    process.env.SYNAPTIK_ICONS_DIR = 'custom/catalog';
    resetSynaptikConfigCache();
    assert.equal(resolveGeneratedIconsRoot(), path.join(tmp, 'custom/catalog'));
  });
});
