import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveRenderDirName } from './render-dir.js';

describe('resolveRenderDirName', () => {
  it('returns base slug for first card', () => {
    assert.equal(resolveRenderDirName('/tmp/empty-renders', 'hero-card'), 'hero-card');
  });

  it('adds suffix when reserved', () => {
    const reserved = new Set(['hero-card']);
    assert.equal(
      resolveRenderDirName('/tmp/x', 'other-id-that-slugifies-same', reserved),
      'other-id-that-slugifies-same',
    );
    assert.equal(resolveRenderDirName('/tmp/x', 'hero-card', reserved), 'hero-card-2');
  });
});
