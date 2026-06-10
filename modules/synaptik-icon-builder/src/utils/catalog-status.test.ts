import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCatalogStatus } from './catalog-status.js';

describe('resolveCatalogStatus', () => {
  it('returns none when not in catalog', () => {
    assert.equal(resolveCatalogStatus(false, { conceptId: 'A' }, null), 'none');
  });

  it('returns current when render matches published', () => {
    assert.equal(
      resolveCatalogStatus(
        true,
        { conceptId: 'A', promptHash: 'h1', publishedAt: '2020-01-01T00:00:00.000Z' },
        { conceptId: 'A', promptHash: 'h1', publishedAt: '2020-01-01T00:00:00.000Z' },
      ),
      'current',
    );
  });

  it('returns outdated when concept differs', () => {
    assert.equal(
      resolveCatalogStatus(
        true,
        { conceptId: 'B', promptHash: 'h1' },
        { conceptId: 'A', promptHash: 'h1', publishedAt: '2020-01-01T00:00:00.000Z' },
      ),
      'outdated',
    );
  });

  it('returns outdated when promptHash differs', () => {
    assert.equal(
      resolveCatalogStatus(
        true,
        { conceptId: 'A', promptHash: 'h2' },
        { conceptId: 'A', promptHash: 'h1', publishedAt: '2020-01-01T00:00:00.000Z' },
      ),
      'outdated',
    );
  });

  it('returns outdated when re-render cleared publishedAt on render meta', () => {
    assert.equal(
      resolveCatalogStatus(
        true,
        { conceptId: 'A', promptHash: 'h1' },
        { conceptId: 'A', promptHash: 'h1', publishedAt: '2020-01-01T00:00:00.000Z' },
      ),
      'outdated',
    );
  });
});
