import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildCardUiForCard } from './hydrateCardUi.js';
import type { SessionState } from '../types.js';

const baseState = (overrides: Partial<SessionState>): SessionState => ({
  sessionId: 's1',
  dna: { projectSlug: 'demo' },
  cards: [{ id: 'c1', title: 'Test' }],
  selections: [],
  conceptCardIds: [],
  previews: {},
  publishedCardIds: [],
  progress: { step: 2, analyzed: true },
  ...overrides,
});

describe('buildCardUiForCard', () => {
  it('marks outdated preview as rendered with needsRepublish', () => {
    const state = baseState({
      previews: { c1: { previewUrl: '/api/session/s1/preview/c1/icon.png' } },
      iconStatus: {
        c1: {
          previewUrl: '/api/session/s1/preview/c1/icon.png',
          publishedUrl: '/api/session/s1/published/c1/icon.png',
          catalogStatus: 'outdated',
        },
      },
      publishedCardIds: ['c1'],
    });
    const ui = buildCardUiForCard(state.cards[0], state, new Set(state.publishedCardIds));
    assert.equal(ui.phase, 'rendered');
    assert.equal(ui.needsRepublish, true);
    assert.ok(ui.previewSrc?.includes('preview/c1'));
  });

  it('hides preview when selection differs from last render', () => {
    const state = baseState({
      previews: { c1: { previewUrl: '/api/session/s1/preview/c1/icon.png' } },
      selections: [{ cardId: 'c1', conceptId: 'B' }],
      iconStatus: {
        c1: {
          previewUrl: '/api/session/s1/preview/c1/icon.png',
          conceptId: 'A',
          catalogStatus: 'none',
        },
      },
    });
    const ui = buildCardUiForCard(state.cards[0], state, new Set());
    assert.equal(ui.phase, 'pick');
    assert.equal(ui.previewStale, true);
    assert.equal(ui.previewSrc, undefined);
    assert.equal(ui.renderedConceptId, 'A');
  });

  it('marks preview stale when session style differs from render', () => {
    const state = baseState({
      iconSetStyleId: 'outline',
      previews: { c1: { previewUrl: '/api/session/s1/preview/c1/icon.png' } },
      selections: [{ cardId: 'c1', conceptId: 'A' }],
      iconStatus: {
        c1: {
          previewUrl: '/api/session/s1/preview/c1/icon.png',
          conceptId: 'A',
          iconSetStyleId: 'glass',
          catalogStatus: 'none',
        },
      },
    });
    const ui = buildCardUiForCard(state.cards[0], state, new Set());
    assert.equal(ui.previewStale, true);
    assert.equal(ui.previewStaleReason, 'style');
  });

  it('shows published with preview when catalog is current', () => {
    const state = baseState({
      previews: { c1: { previewUrl: '/api/session/s1/preview/c1/icon.png' } },
      iconStatus: {
        c1: {
          previewUrl: '/api/session/s1/preview/c1/icon.png',
          catalogStatus: 'current',
        },
      },
      publishedCardIds: ['c1'],
    });
    const ui = buildCardUiForCard(state.cards[0], state, new Set(state.publishedCardIds));
    assert.equal(ui.phase, 'published');
    assert.equal(ui.needsRepublish, undefined);
  });
});
