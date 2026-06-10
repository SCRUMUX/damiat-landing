import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeContentBlocks, namespaceBlocksForPage } from './merge-content.js';
import type { ContentBlock } from '../types/index.js';

describe('namespaceBlocksForPage', () => {
  it('prefixes ids and sets source page', () => {
    const blocks: ContentBlock[] = [
      {
        id: 'benefits',
        title: 'Benefits',
        cards: [{ id: 'speed', title: 'Speed' }],
      },
    ];
    const out = namespaceBlocksForPage(blocks, 'about', 'https://x.com/about', 'About');
    assert.equal(out[0].id, 'about-benefits');
    assert.equal(out[0].sourcePageUrl, 'https://x.com/about');
    assert.equal(out[0].cards[0].id, 'about-speed');
  });
});

describe('mergeContentBlocks', () => {
  it('appends blocks without id collision', () => {
    const existing: ContentBlock[] = [
      { id: 'hero', title: 'Hero', cards: [{ id: 'main', title: 'Main' }] },
    ];
    const incoming: ContentBlock[] = [
      { id: 'hero', title: 'Other Hero', cards: [{ id: 'main', title: 'Other' }] },
    ];
    const merged = mergeContentBlocks(existing, incoming);
    assert.equal(merged.length, 2);
    assert.equal(merged[1].id, 'hero-2');
    assert.equal(merged[1].cards[0].id, 'main-2');
  });
});
