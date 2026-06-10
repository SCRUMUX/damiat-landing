import sharp from 'sharp';
import type { IconQualityWarning } from '../types/index.js';

export type { IconQualityWarning };

export interface IconQaResult {
  ok: boolean;
  warnings: IconQualityWarning[];
}

const WHITE = 255;
const CORNER_TOLERANCE = 18;
const MIN_SUBJECT_MARGIN_RATIO = 0.08;

function isNearWhite(r: number, g: number, b: number, tolerance: number): boolean {
  return r >= WHITE - tolerance && g >= WHITE - tolerance && b >= WHITE - tolerance;
}

async function loadRaw(buf: Buffer, size?: number) {
  let pipeline = sharp(buf).ensureAlpha();
  if (size) pipeline = pipeline.resize(size, size, { fit: 'fill' });
  return pipeline.raw().toBuffer({ resolveWithObject: true });
}

/** Sample corners and outer edge ring — expect near-white canvas. */
export async function checkWhiteBackground(
  buf: Buffer,
  tolerance = CORNER_TOLERANCE,
): Promise<boolean> {
  const { data, info } = await loadRaw(buf);
  const { width, height, channels } = info;
  if (width < 4 || height < 4) return false;

  const sample = (x: number, y: number) => {
    const i = (y * width + x) * channels;
    const a = channels === 4 ? data[i + 3] : 255;
    if (a < 200) return false;
    return isNearWhite(data[i], data[i + 1], data[i + 2], tolerance);
  };

  const corners = [
    sample(0, 0),
    sample(width - 1, 0),
    sample(0, height - 1),
    sample(width - 1, height - 1),
  ];
  if (!corners.every(Boolean)) return false;

  const band = Math.max(2, Math.floor(Math.min(width, height) * 0.1));
  let edgeSamples = 0;
  let edgeWhite = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const onEdge =
        x < band || x >= width - band || y < band || y >= height - band;
      if (!onEdge) continue;
      edgeSamples++;
      if (sample(x, y)) edgeWhite++;
    }
  }

  return edgeSamples > 0 && edgeWhite / edgeSamples >= 0.88;
}

export async function checkSuspectedText(buf: Buffer): Promise<boolean> {
  const { data, info } = await loadRaw(buf, 128);
  const { width, height, channels } = info;
  const margin = Math.floor(width * 0.2);
  let darkSpecks = 0;
  let samples = 0;

  for (let y = margin; y < height - margin; y += 2) {
    for (let x = margin; x < width - margin; x += 2) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum > 240) continue;
      samples++;
      if (x > 0 && x < width - 1) {
        const left = (y * width + (x - 1)) * channels;
        const right = (y * width + (x + 1)) * channels;
        const lumL = 0.299 * data[left] + 0.587 * data[left + 1] + 0.114 * data[left + 2];
        const lumR = 0.299 * data[right] + 0.587 * data[right + 1] + 0.114 * data[right + 2];
        if (Math.abs(lum - lumL) > 40 && Math.abs(lum - lumR) > 40 && lum < 200) {
          darkSpecks++;
        }
      }
    }
  }

  if (samples < 20) return false;
  return darkSpecks / samples > 0.08;
}

/** Bbox of non-white pixels; fail if subject touches canvas edge. */
export async function checkSubjectMargins(buf: Buffer): Promise<boolean> {
  const { data, info } = await loadRaw(buf, 256);
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum > 248) continue;
      found = true;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (!found) return true;

  const marginX = minX / width;
  const marginY = minY / height;
  const marginRight = (width - 1 - maxX) / width;
  const marginBottom = (height - 1 - maxY) / height;
  const minMargin = Math.min(marginX, marginY, marginRight, marginBottom);
  return minMargin >= MIN_SUBJECT_MARGIN_RATIO;
}

/** High-frequency noise in white border band (JPEG grain). */
export async function checkGrainyBorder(buf: Buffer): Promise<boolean> {
  const { data, info } = await loadRaw(buf, 128);
  const { width, height, channels } = info;
  const band = Math.floor(width * 0.12);
  let varianceSum = 0;
  let count = 0;

  const lumAt = (x: number, y: number) => {
    const i = (y * width + x) * channels;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const onEdge = x < band || x >= width - band || y < band || y >= height - band;
      if (!onEdge || lumAt(x, y) < 230) continue;
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
        const c = lumAt(x, y);
        const lap =
          -4 * c +
          lumAt(x - 1, y) +
          lumAt(x + 1, y) +
          lumAt(x, y - 1) +
          lumAt(x, y + 1);
        varianceSum += lap * lap;
        count++;
      }
    }
  }

  if (count < 50) return false;
  return varianceSum / count > 120;
}

export async function runIconQa(buf: Buffer): Promise<IconQaResult> {
  const warnings: IconQualityWarning[] = [];
  if (!(await checkWhiteBackground(buf))) warnings.push('non_white_edges');
  if (!(await checkSubjectMargins(buf))) warnings.push('cropped_edges');
  if (await checkGrainyBorder(buf)) warnings.push('grainy_border');
  if (await checkSuspectedText(buf)) warnings.push('possible_text');
  return { ok: warnings.length === 0, warnings };
}
