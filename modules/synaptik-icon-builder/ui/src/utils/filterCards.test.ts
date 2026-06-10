import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cardMatchesSearch, filterCardsBySearch } from './filterCards.js';
import type { Card } from '../types.js';

const sample: Card = {
  id: 'hero-main',
  title: 'Автономность',
  blockTitle: 'Генератор',
  sourcePageUrl: 'https://example.com/features',
};

describe('filterCardsBySearch', () => {
  it('returns all when query empty', () => {
    assert.equal(filterCardsBySearch([sample], '').length, 1);
  });

  it('matches card title', () => {
    assert.equal(filterCardsBySearch([sample], 'автоном').length, 1);
  });

  it('matches page path', () => {
    assert.equal(filterCardsBySearch([sample], '/features').length, 1);
  });

  it('filters non-matching', () => {
    assert.equal(filterCardsBySearch([sample], 'pricing').length, 0);
  });
});

describe('cardMatchesSearch', () => {
  it('is case insensitive', () => {
    assert.equal(cardMatchesSearch(sample, 'ГЕНЕРАТОР'), true);
  });
});
