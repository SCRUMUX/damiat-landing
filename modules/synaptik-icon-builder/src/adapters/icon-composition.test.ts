import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { checkWhiteBackground } from './icon-qa.js';
import {
  ICON_SUBJECT_FILL,
  knockOutNearWhiteBackdrop,
  normalizeIconComposition,
} from './icon-composition.js';

async function makeIconWithSmallSubject(canvas: number, subject: number): Promise<Buffer> {
  const offset = Math.round((canvas - subject) / 2);
  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp({
          create: {
            width: subject,
            height: subject,
            channels: 4,
            background: { r: 200, g: 50, b: 50, alpha: 255 },
          },
        })
          .png()
          .toBuffer(),
        left: offset,
        top: offset,
      },
    ])
    .png()
    .toBuffer();
}

describe('normalizeIconComposition', () => {
  it('scales up a small subject toward target fill', async () => {
    const input = await makeIconWithSmallSubject(256, 64);
    const out = await normalizeIconComposition(input);
    const trimmed = await sharp(out).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
    const fill = Math.max(trimmed.info.width, trimmed.info.height) / 256;
    assert.ok(fill >= ICON_SUBJECT_FILL.min - 0.02);
    assert.ok(fill <= ICON_SUBJECT_FILL.max + 0.02);
  });

  it('knocks out near-white backdrop with feather', async () => {
    const whiteSquare = await sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 255 },
      },
    })
      .composite([
        {
          input: await sharp({
            create: {
              width: 24,
              height: 24,
              channels: 4,
              background: { r: 40, g: 160, b: 80, alpha: 255 },
            },
          })
            .png()
            .toBuffer(),
          left: 20,
          top: 20,
        },
      ])
      .png()
      .toBuffer();

    const out = await knockOutNearWhiteBackdrop(whiteSquare);
    const { data, info } = await sharp(out).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const cornerIdx = 0;
    assert.equal(data[cornerIdx + 3], 0);

    const centerIdx = (32 * info.width + 32) * info.channels;
    assert.ok(data[centerIdx + 3] > 200);
  });

  it('flattens colored backdrop to white canvas', async () => {
    const grayBg = await sharp({
      create: {
        width: 256,
        height: 256,
        channels: 3,
        background: { r: 120, g: 120, b: 120 },
      },
    })
      .png()
      .toBuffer();
    const input = await makeIconWithSmallSubject(256, 96);
    const onGray = await sharp(grayBg)
      .composite([{ input, blend: 'over' }])
      .png()
      .toBuffer();
    const out = await normalizeIconComposition(onGray);
    assert.equal(await checkWhiteBackground(out), true);
  });
});
