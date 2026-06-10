import sharp from 'sharp';

/** Icon subject should cover this fraction of the square canvas (linear, longer side). */
export const ICON_SUBJECT_FILL = {
  min: 0.65,
  max: 0.85,
  target: 0.75,
} as const;

const WHITE_BG = { r: 255, g: 255, b: 255, alpha: 255 } as const;
const SUBJECT_LUM_THRESHOLD = 248;
/** Knock-out backdrop for brand panels — keep subject highlights above this. */
const BACKDROP_KNOCKOUT_THRESHOLD = 252;
const BACKDROP_KNOCKOUT_FEATHER = 5;
const EDGE_TOUCH_RATIO = 0.02;
const BBOX_PADDING_RATIO = 0.1;

export interface NormalizeIconOptions {
  minFill?: number;
  maxFill?: number;
  targetFill?: number;
  trimThreshold?: number;
}

interface Bbox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

async function detectSubjectBbox(
  rgba: Buffer,
  width: number,
  height: number,
  channels: number,
): Promise<Bbox | null> {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const a = channels === 4 ? rgba[i + 3] : 255;
      if (a < 128) continue;
      const lum = 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2];
      if (lum > SUBJECT_LUM_THRESHOLD) continue;
      found = true;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (!found || maxX <= minX || maxY <= minY) return null;
  return { minX, minY, maxX, maxY };
}

function bboxTouchesEdge(bbox: Bbox, width: number, height: number): boolean {
  const touchX =
    bbox.minX / width < EDGE_TOUCH_RATIO ||
    (width - 1 - bbox.maxX) / width < EDGE_TOUCH_RATIO;
  const touchY =
    bbox.minY / height < EDGE_TOUCH_RATIO ||
    (height - 1 - bbox.maxY) / height < EDGE_TOUCH_RATIO;
  return touchX || touchY;
}

/**
 * Flatten to white, safe crop with padding, scale subject to 65–85% fill, center on white square.
 */
export async function normalizeIconComposition(
  input: Buffer,
  opts: NormalizeIconOptions = {},
): Promise<Buffer> {
  const minFill = opts.minFill ?? ICON_SUBJECT_FILL.min;
  const maxFill = opts.maxFill ?? ICON_SUBJECT_FILL.max;
  const targetFill = opts.targetFill ?? ICON_SUBJECT_FILL.target;
  const trimThreshold = opts.trimThreshold ?? 8;

  const meta = await sharp(input).metadata();
  const size = meta.width ?? meta.height;
  if (!size || !meta.width || !meta.height) {
    return input;
  }

  const flattened = await sharp(input)
    .flatten({ background: WHITE_BG })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = flattened;
  const { width, height, channels } = info;
  const bbox = await detectSubjectBbox(data, width, height, channels);

  let subjectBuf: Buffer;

  if (bbox && bboxTouchesEdge(bbox, width, height)) {
    const padX = Math.round((bbox.maxX - bbox.minX + 1) * BBOX_PADDING_RATIO);
    const padY = Math.round((bbox.maxY - bbox.minY + 1) * BBOX_PADDING_RATIO);
    const left = Math.max(0, bbox.minX - padX);
    const top = Math.max(0, bbox.minY - padY);
    const w = Math.min(width - left, bbox.maxX - bbox.minX + 1 + padX * 2);
    const h = Math.min(height - top, bbox.maxY - bbox.minY + 1 + padY * 2);
    subjectBuf = await sharp(input)
      .flatten({ background: WHITE_BG })
      .extract({ left, top, width: w, height: h })
      .png()
      .toBuffer();
  } else {
    subjectBuf = await sharp(input)
      .flatten({ background: WHITE_BG })
      .trim({ threshold: trimThreshold })
      .png()
      .toBuffer();
  }

  const trimmedMeta = await sharp(subjectBuf).metadata();
  const tw = trimmedMeta.width ?? 1;
  const th = trimmedMeta.height ?? 1;
  if (tw < 1 || th < 1) {
    return sharp(input).flatten({ background: WHITE_BG }).png().toBuffer();
  }

  const maxDim = Math.max(tw, th);
  const canvasSize = Math.max(size, meta.width, meta.height);
  const currentFill = maxDim / canvasSize;

  let targetMaxDim: number;
  if (currentFill < minFill || currentFill > maxFill) {
    targetMaxDim = Math.round(canvasSize * targetFill);
  } else {
    targetMaxDim = maxDim;
  }

  const scale = targetMaxDim / maxDim;
  const newW = Math.max(1, Math.round(tw * scale));
  const newH = Math.max(1, Math.round(th * scale));

  const resized = await sharp(subjectBuf)
    .resize(newW, newH, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const left = Math.round((canvasSize - newW) / 2);
  const top = Math.round((canvasSize - newH) / 2);

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: WHITE_BG,
    },
  })
    .composite([{ input: resized, left, top }])
    .flatten({ background: WHITE_BG })
    .png()
    .toBuffer();
}

function backdropKnockoutAlpha(r: number, g: number, b: number): number {
  const lum = Math.min(r, g, b);
  if (lum >= BACKDROP_KNOCKOUT_THRESHOLD) return 0;
  if (lum >= BACKDROP_KNOCKOUT_THRESHOLD - BACKDROP_KNOCKOUT_FEATHER) {
    return Math.round(
      ((BACKDROP_KNOCKOUT_THRESHOLD - lum) / BACKDROP_KNOCKOUT_FEATHER) * 255,
    );
  }
  return 255;
}

/**
 * Make near-white canvas transparent for primary brand panels (conservative threshold + feather).
 * Standard white cards still look correct — surface-1 shows through transparent areas.
 */
export async function knockOutNearWhiteBackdrop(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 4) {
    return input;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const knockout = backdropKnockoutAlpha(data[i], data[i + 1], data[i + 2]);
      data[i + 3] = Math.round((data[i + 3] * knockout) / 255);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer();
}
