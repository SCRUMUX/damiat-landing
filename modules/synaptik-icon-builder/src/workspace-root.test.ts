import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getWorkspaceRoot, resetWorkspaceRootCache } from './workspace-root.js';

describe('workspace-root', () => {
  let tmp: string;
  let prevCwd: string;
  let prevEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-ws-'));
    prevCwd = process.cwd();
    prevEnv = { ...process.env };
    delete process.env.SYNAPTIK_WORKSPACE_ROOT;
    delete process.env.AICADS_REPO_ROOT;
    resetWorkspaceRootCache();
  });

  afterEach(() => {
    process.chdir(prevCwd);
    process.env = prevEnv;
    resetWorkspaceRootCache();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('prefers parent with synaptik.config.json when cwd is Synaptik UI package', () => {
    const product = path.join(tmp, 'my-product');
    const ui = path.join(tmp, 'my-product', 'node_modules', 'synaptik', 'ui');
    fs.mkdirSync(ui, { recursive: true });
    fs.writeFileSync(
      path.join(product, 'synaptik.config.json'),
      JSON.stringify({ outputDir: 'src/assets/generated-icons' }),
      'utf8',
    );
    fs.writeFileSync(path.join(product, 'package.json'), '{"name":"my-product"}', 'utf8');
    fs.writeFileSync(
      path.join(ui, 'package.json'),
      JSON.stringify({ name: '@synaptik/icon-builder-ui' }),
      'utf8',
    );

    process.chdir(ui);
    resetWorkspaceRootCache();
    assert.equal(getWorkspaceRoot(), product);
  });

  it('skips @synaptik/icon-builder-ui and uses monorepo-style parent package.json', () => {
    const repo = path.join(tmp, 'aicads');
    const ui = path.join(repo, 'modules', 'synaptik-icon-builder', 'ui');
    fs.mkdirSync(ui, { recursive: true });
    fs.writeFileSync(path.join(repo, 'package.json'), '{"name":"@ai-ds/core"}', 'utf8');
    fs.writeFileSync(
      path.join(ui, 'package.json'),
      JSON.stringify({ name: '@synaptik/icon-builder-ui' }),
      'utf8',
    );

    process.chdir(ui);
    resetWorkspaceRootCache();
    assert.equal(getWorkspaceRoot(), repo);
  });

  it('honors SYNAPTIK_WORKSPACE_ROOT override', () => {
    const product = path.join(tmp, 'explicit-root');
    fs.mkdirSync(product, { recursive: true });
    fs.writeFileSync(path.join(product, 'package.json'), '{"name":"x"}', 'utf8');
    process.env.SYNAPTIK_WORKSPACE_ROOT = product;
    const elsewhere = path.join(tmp, 'elsewhere');
    fs.mkdirSync(elsewhere, { recursive: true });
    process.chdir(elsewhere);
    resetWorkspaceRootCache();
    assert.equal(getWorkspaceRoot(), product);
  });
});
