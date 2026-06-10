import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildStorybookUrl,
  generatedIconsStoryPath,
  resolveStorybookProjectSlug,
  slugify,
} from './storybookLink.js';

describe('storybookLink', () => {
  it('slugify matches Storybook ids', () => {
    assert.equal(slugify('Generated Icons'), 'generated-icons');
    assert.equal(slugify('All icons'), 'all-icons');
  });

  it('builds project icons path', () => {
    assert.equal(
      generatedIconsStoryPath('web-hosting-domain-services'),
      '/story/generated-icons-web-hosting-domain-services--all-icons',
    );
  });

  it('builds index path without project', () => {
    assert.equal(generatedIconsStoryPath(), '/story/generated-icons--index');
  });

  it('drops slug not in registry', () => {
    assert.equal(
      resolveStorybookProjectSlug('agriculture-technology', ['other-project']),
      undefined,
    );
    assert.equal(
      resolveStorybookProjectSlug('agriculture-technology', ['agriculture-technology']),
      'agriculture-technology',
    );
  });

  it('builds full url', () => {
    const url = buildStorybookUrl('http://127.0.0.1:6006', 'my-project');
    assert.ok(url.startsWith('http://127.0.0.1:6006/?path='));
    assert.ok(url.includes('generated-icons-my-project--all-icons'));
  });
});
