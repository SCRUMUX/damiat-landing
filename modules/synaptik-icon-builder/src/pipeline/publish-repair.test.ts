import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { repairGeneratedIconsCatalog, rebuildRegistryFromDisk } from './publish.js';
import { writeJsonFile } from '../fs-json.js';

describe('repairGeneratedIconsCatalog', () => {
  let tmp = '';
  let prevRepo = '';

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'synaptik-repair-'));
    prevRepo = process.env.AICADS_REPO_ROOT ?? '';
    process.env.AICADS_REPO_ROOT = tmp;

    const sessionId = 'sess1';
    const sessionDir = path.join(tmp, '.synaptik', 'sessions', sessionId);
    const rendersDir = path.join(sessionDir, 'renders', 'icon-a');
    fs.mkdirSync(rendersDir, { recursive: true });

    writeJsonFile(path.join(sessionDir, 'style-dna.json'), {
      projectSlug: 'demo-project',
      industry: 'Demo',
      rendering: 'flat',
      materials: [],
      palette: ['#fff'],
      lighting: 'soft',
      background: 'white',
      brandCharacter: 'friendly',
      styleLabel: 'Test',
      createdAt: new Date().toISOString(),
    });

    const meta = {
      name: 'Icon A',
      category: 'Demo',
      style: 'Test',
      createdBy: 'AI Icon Builder',
      sessionId,
      cardId: 'card-a',
      iconSlug: 'icon-a',
      publishedAt: new Date().toISOString(),
    };
    writeJsonFile(path.join(rendersDir, 'meta.json'), meta);
    fs.writeFileSync(path.join(rendersDir, 'icon.png'), Buffer.from([0x89, 0x50]));
    fs.writeFileSync(path.join(rendersDir, 'icon.webp'), Buffer.from([0x52, 0x49]));

    writeJsonFile(path.join(tmp, 'generated-icons', 'registry.json'), { version: 1, icons: [] });
  });

  after(() => {
    if (prevRepo) process.env.AICADS_REPO_ROOT = prevRepo;
    else delete process.env.AICADS_REPO_ROOT;
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('republishes from session and rebuilds registry', () => {
    const { republished, iconCount } = repairGeneratedIconsCatalog();
    assert.equal(republished.length, 1);
    assert.equal(iconCount, 1);
    const icons = rebuildRegistryFromDisk();
    assert.equal(icons[0]?.projectSlug, 'demo-project');
    assert.ok(fs.existsSync(path.join(tmp, 'generated-icons', 'demo-project', 'icon-a', 'icon.png')));
    assert.ok(
      fs.existsSync(path.join(tmp, 'generated-icons', 'demo-project', 'Icons.stories.tsx')),
    );
  });
});
