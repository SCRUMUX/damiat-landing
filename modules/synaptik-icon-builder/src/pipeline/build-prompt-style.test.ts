import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveFluxStyleBlock } from './build-prompt.js';
import { resolveSessionIconSetStyleId } from './icon-style-bible.js';
import type { SessionPaths } from '../paths.js';

function testSessionPaths(sessionDir: string, sessionId: string): SessionPaths {
  return {
    sessionId,
    sessionDir,
    manifest: path.join(sessionDir, 'manifest.json'),
    captureReport: path.join(sessionDir, 'capture-report.json'),
    styleDna: path.join(sessionDir, 'style-dna.json'),
    iconStyleBible: path.join(sessionDir, 'icon-style-bible.json'),
    contentCards: path.join(sessionDir, 'content-cards.json'),
    contentStructure: path.join(sessionDir, 'content-structure.json'),
    conceptsDir: path.join(sessionDir, 'concepts'),
    semanticDir: path.join(sessionDir, 'semantic'),
    promptsDir: path.join(sessionDir, 'prompts'),
    selections: path.join(sessionDir, 'selections.json'),
    screenshotsDir: path.join(sessionDir, 'screenshots'),
    rendersDir: path.join(sessionDir, 'renders'),
  };
}

describe('resolveFluxStyleBlock with manifest vs stale bible', () => {
  let tmp: string;
  let paths: SessionPaths;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-style-'));
    const sessionId = 'test-style';
    const sessionDir = path.join(tmp, sessionId);
    fs.mkdirSync(sessionDir, { recursive: true });
    paths = testSessionPaths(sessionDir, sessionId);
    fs.writeFileSync(
      paths.manifest,
      JSON.stringify({
        sessionId,
        createdAt: new Date().toISOString(),
        sourceUrl: 'https://example.com',
        iconSetStyleId: 'outline',
      }),
      'utf8',
    );
    fs.writeFileSync(
      paths.iconStyleBible,
      JSON.stringify({
        iconSetStyleId: 'glass',
        presetVersion: 1,
        styleBlock: 'Glass icon set.\nOld frozen block that must not be used.',
        styleAnchor: 'Test brand iconography',
        paletteLine: '#112233, #445566',
        forbiddenStyles: [],
        aesthetic: 'Glass icon set',
        materialsLine: 'glass',
        renderMode: 'glass mode',
        paletteForIcons: ['#112233'],
        materialsAllowed: [],
        materialsForbidden: [],
        generatedAt: new Date().toISOString(),
      }),
      'utf8',
    );
    fs.writeFileSync(
      paths.styleDna,
      JSON.stringify({
        projectSlug: 'test',
        industry: 'tech',
        palette: ['#112233'],
      }),
      'utf8',
    );
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('uses manifest iconSetStyleId, not stale bible id or styleBlock', () => {
    assert.equal(resolveSessionIconSetStyleId(paths), 'outline');
    const block = resolveFluxStyleBlock(paths);
    assert.match(block, /Outline icon set/i);
    assert.match(block, /Icon set style preset: outline/);
    assert.doesNotMatch(block, /Glass icon set/i);
    assert.doesNotMatch(block, /Old frozen block/);
  });
});
