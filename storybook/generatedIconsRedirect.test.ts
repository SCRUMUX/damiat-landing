import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  GENERATED_ICONS_CATALOG_PATH,
  buildStaleGeneratedIconsManagerHeadScript,
  projectSlugFromStoryPath,
  publishedProjectSlugs,
  redirectStaleGeneratedIconsStoryPath,
} from './generatedIconsRedirect.js';

describe('generatedIconsRedirect', () => {
  it('parses agriculture-technology from story path', () => {
    assert.equal(
      projectSlugFromStoryPath('/story/generated-icons-agriculture-technology--all-icons'),
      'agriculture-technology',
    );
  });

  it('catalog path is index', () => {
    assert.equal(GENERATED_ICONS_CATALOG_PATH, '/story/generated-icons--index');
  });

  it('empty registry has no published slugs', () => {
    assert.equal(publishedProjectSlugs().has('agriculture-technology'), false);
  });

  it('redirectStale replaces stale path', () => {
    let next = '';
    redirectStaleGeneratedIconsStoryPath(
      '?path=%2Fstory%2Fgenerated-icons-agriculture-technology--all-icons',
      new Set(),
      (url) => {
        next = url;
      },
    );
    assert.match(next, /generated-icons--index/);
  });

  it('manager head script includes catalog path', () => {
    const script = buildStaleGeneratedIconsManagerHeadScript();
    assert.match(script, /generated-icons--index/);
    assert.match(script, /<script>/);
  });
});
