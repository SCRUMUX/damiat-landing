import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  assembleStyleBlock,
  migrateLegacyBible,
  DEFAULT_FORBIDDEN_STYLES,
} from './icon-style-bible.js';

describe('assembleStyleBlock', () => {
  it('uses newline-separated short lines', () => {
    const block = assembleStyleBlock({
      aesthetic: 'Premium test icon set',
      styleAnchor: 'Test anchor',
      renderMode: 'Stylized isometric 3D',
      materialsLine: 'Glass and titanium',
      paletteLine: '#AABBCC',
      forbiddenStyles: ['photorealistic'],
    });
    assert.ok(block.includes('\n'));
    assert.match(block, /Premium test icon set/);
    assert.match(block, /No photorealistic photography/i);
  });
});

describe('migrateLegacyBible', () => {
  it('builds styleBlock from old bible fields', () => {
    const bible = migrateLegacyBible({
      styleAnchor: 'Damiat set',
      globalRenderRules: 'product icons',
      paletteForIcons: ['#2BCB7A'],
      materialsAllowed: ['glass'],
      lightingForIcons: 'soft',
      compositionRules: 'centered',
      promptPrefix: 'prefix',
      promptSuffix: 'suffix',
      generatedAt: '2026-06-02T00:00:00.000Z',
    });
    assert.ok(bible.styleBlock.length > 50);
    assert.ok(bible.forbiddenStyles.length >= DEFAULT_FORBIDDEN_STYLES.length);
  });
});
