import fs from 'node:fs';
import path from 'node:path';
import { MVP_DEFAULTS } from '../../types/index.js';

export async function imageToDataUrl(filePath: string): Promise<string> {
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export function listScreenshotPaths(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => path.join(dir, f));
}

/** Prefer full-page capture for structure analysis; fall back to viewport. */
export function listAnalyzeScreenshotPaths(dir: string): string[] {
  const max = MVP_DEFAULTS.visionImagesPerCall;
  const fullpage = path.join(dir, 'fullpage.png');
  const viewport = path.join(dir, 'viewport.png');
  const ordered: string[] = [];
  if (fs.existsSync(fullpage)) ordered.push(fullpage);
  if (fs.existsSync(viewport)) ordered.push(viewport);
  if (ordered.length > 0) return ordered.slice(0, max);
  return listScreenshotPaths(dir).slice(0, max);
}
