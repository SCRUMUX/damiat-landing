import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pageSlugFromUrl, sameOrigin, shortPagePath } from './page-url.js';

describe('sameOrigin', () => {
  it('matches same host', () => {
    assert.equal(
      sameOrigin('https://example.com/', 'https://example.com/pricing'),
      true,
    );
  });

  it('rejects different host', () => {
    assert.equal(sameOrigin('https://a.com', 'https://b.com'), false);
  });
});

describe('pageSlugFromUrl', () => {
  it('uses home for root', () => {
    assert.equal(pageSlugFromUrl('https://x.com/'), 'home');
  });

  it('slugifies path', () => {
    assert.equal(pageSlugFromUrl('https://x.com/about-us'), 'about-us');
  });
});

describe('shortPagePath', () => {
  it('returns pathname', () => {
    assert.equal(shortPagePath('https://x.com/pricing/'), '/pricing');
  });
});
