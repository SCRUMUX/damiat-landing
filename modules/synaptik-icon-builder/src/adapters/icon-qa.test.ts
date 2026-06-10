import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { checkWhiteBackground, runIconQa } from './icon-qa.js';

async function whiteSquare(size: number): Promise<Buffer> {
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();
}

async function darkCornerSquare(size: number): Promise<Buffer> {
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 40, g: 40, b: 40 },
    },
  })
    .png()
    .toBuffer();
}

describe('icon-qa', () => {
  it('passes a pure white canvas', async () => {
    const buf = await whiteSquare(256);
    assert.equal(await checkWhiteBackground(buf), true);
    const qa = await runIconQa(buf);
    assert.equal(qa.ok, true);
    assert.equal(qa.warnings.length, 0);
  });

  it('fails non-white edges', async () => {
    const buf = await darkCornerSquare(256);
    assert.equal(await checkWhiteBackground(buf), false);
    const qa = await runIconQa(buf);
    assert.ok(qa.warnings.includes('non_white_edges'));
  });
});
