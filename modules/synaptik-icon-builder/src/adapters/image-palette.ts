import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function quantize(v: number): number {
  return Math.min(255, Math.round(v / 32) * 32);
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

/** Extract top dominant hex colors from a screenshot via resized pixel sampling. */
export async function extractPaletteFromImage(
  imagePath: string,
  maxColors = 12,
): Promise<string[]> {
  const { data, info } = await sharp(imagePath)
    .resize(64, 64, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const counts = new Map<string, number>();
  const channels = info.channels;

  for (let i = 0; i < data.length; i += channels) {
    const a = channels === 4 ? data[i + 3] : 255;
    if (a < 128) continue;
    const hex = rgbToHex(
      quantize(data[i]),
      quantize(data[i + 1]),
      quantize(data[i + 2]),
    );
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([hex]) => hex);
}

export async function extractPaletteFromScreenshotsDir(
  screenshotsDir: string,
  preferred = 'viewport.png',
): Promise<string[]> {
  const preferredPath = path.join(screenshotsDir, preferred);
  if (fs.existsSync(preferredPath)) {
    return extractPaletteFromImage(preferredPath);
  }
  const files = fs.readdirSync(screenshotsDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (files.length === 0) return [];
  return extractPaletteFromImage(path.join(screenshotsDir, files[0]));
}
