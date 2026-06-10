/**
 * Restore white canvas on published icons (reverts knockOutNearWhiteBackdrop).
 *
 * Usage: npx tsx scripts/restore-white-backdrop-published.ts [--root path/to/agritech]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WHITE_BG = { r: 255, g: 255, b: 255, alpha: 255 } as const;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, '../../../generated-icons/agritech');

const rootArg = process.argv.find((a) => a.startsWith('--root='));
const iconsRoot = rootArg ? path.resolve(rootArg.slice('--root='.length)) : defaultRoot;

async function restoreIconDir(dir: string): Promise<void> {
  const pngPath = path.join(dir, 'icon.png');
  if (!fs.existsSync(pngPath)) return;

  const flattened = await sharp(pngPath).flatten({ background: WHITE_BG }).png().toBuffer();
  const webpBuf = await sharp(flattened).webp({ quality: 88 }).toBuffer();

  fs.writeFileSync(pngPath, flattened);
  fs.writeFileSync(path.join(dir, 'icon.webp'), webpBuf);
  console.log(`restored ${path.relative(iconsRoot, dir)}`);
}

async function main(): Promise<void> {
  if (!fs.existsSync(iconsRoot)) {
    throw new Error(`Icons root not found: ${iconsRoot}`);
  }

  const dirs = fs
    .readdirSync(iconsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(iconsRoot, d.name));

  for (const dir of dirs) {
    await restoreIconDir(dir);
  }

  console.log(`Done (${dirs.length} dirs).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
