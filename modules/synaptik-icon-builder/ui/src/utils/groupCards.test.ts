import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { groupCardsByBlock } from './groupCards.js';
import type { Card, ContentBlock } from '../types.js';

describe('groupCardsByBlock', () => {
  it('does not attach all cards to every block when block.id collides', () => {
    const blocks: ContentBlock[] = [
      {
        id: 'icon',
        title: 'Block A',
        sortOrder: 0,
        cards: [{ id: 'card-a', title: 'Card A' }],
      },
      {
        id: 'icon',
        title: 'Block B',
        sortOrder: 1,
        cards: [{ id: 'card-b', title: 'Card B' }],
      },
    ];
    const cards: Card[] = [
      { id: 'card-a', title: 'Card A', blockId: 'icon', blockTitle: 'Block A' },
      { id: 'card-b', title: 'Card B', blockId: 'icon', blockTitle: 'Block B' },
    ];
    const groups = groupCardsByBlock(cards, blocks);
    const blockGroups = groups.filter((g) => g.blockKey !== 'general');
    assert.equal(blockGroups.length, 2);
    assert.equal(blockGroups[0].cards.length, 1);
    assert.equal(blockGroups[0].cards[0].id, 'card-a');
    assert.equal(blockGroups[1].cards.length, 1);
    assert.equal(blockGroups[1].cards[0].id, 'card-b');
    assert.notEqual(blockGroups[0].blockKey, blockGroups[1].blockKey);
  });
});
