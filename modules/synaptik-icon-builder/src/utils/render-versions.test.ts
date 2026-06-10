import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  archiveCurrentRender,
  listRenderVersions,
  registerNewActiveVersion,
  setActiveRenderVersion,
} from './render-versions.js';
import { AssetMetaSchema } from '../types/index.js';
import { writeJsonFile } from '../fs-json.js';

describe('render-versions', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-versions-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('archives previous render before overwrite', () => {
    const renderDir = path.join(tmpDir, 'card-a');
    fs.mkdirSync(renderDir, { recursive: true });
    fs.writeFileSync(path.join(renderDir, 'icon.png'), 'png1');
    const meta = AssetMetaSchema.parse({
      name: 'CardA',
      category: 'general',
      style: 'test',
      cardId: 'card-a',
      conceptId: 'A',
    });
    writeJsonFile(path.join(renderDir, 'meta.json'), meta);

    archiveCurrentRender(renderDir);
    fs.writeFileSync(path.join(renderDir, 'icon.png'), 'png2');
    registerNewActiveVersion(renderDir, { ...meta, conceptId: 'B' });

    const index = listRenderVersions(renderDir);
    assert.ok(index.versions.length >= 2);
    const active = index.versions.find((v) => v.id === index.activeVersionId);
    assert.equal(active?.conceptId, 'B');
  });

  it('restores an older version to root', () => {
    const renderDir = path.join(tmpDir, 'card-b');
    fs.mkdirSync(renderDir, { recursive: true });
    fs.writeFileSync(path.join(renderDir, 'icon.png'), 'first');
    const metaA = AssetMetaSchema.parse({
      name: 'CardB',
      category: 'general',
      style: 'test',
      conceptId: 'A',
    });
    writeJsonFile(path.join(renderDir, 'meta.json'), metaA);
    const archived = archiveCurrentRender(renderDir);
    assert.ok(archived);

    fs.writeFileSync(path.join(renderDir, 'icon.png'), 'second');
    const metaB = { ...metaA, conceptId: 'B' };
    writeJsonFile(path.join(renderDir, 'meta.json'), metaB);
    registerNewActiveVersion(renderDir, metaB);

    setActiveRenderVersion(renderDir, archived!);
    assert.equal(fs.readFileSync(path.join(renderDir, 'icon.png'), 'utf8'), 'first');
    const index = listRenderVersions(renderDir);
    assert.equal(index.activeVersionId, archived);
  });
});
