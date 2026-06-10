/**
 * One-off / maintenance: knock out near-white backdrops on published DAMIAT agritech icons.
 * Safe for white cards (surface-1 shows through) and primary brand panels.
 *
 * Usage: npx tsx scripts/strip-white-backdrop-published.ts [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { knockOutNearWhiteBackdrop } from '../src/adapters/icon-composition.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsRoot = path.resolve(__dirname, '../../../generated-icons/agritech');
const dryRun = process.argv.includes('--dry-run');

async function processIconDir(dir: string): Promise<void> {
  const pngPath = path.join(dir, 'icon.png');
  if (!fs.existsSync(pngPath)) return;

  const knocked = await knockOutNearWhiteBackdrop(fs.readFileSync(pngPath));
  const webpBuf = await sharp(knocked).webp({ quality: 88 }).toBuffer();

  if (dryRun) {
    console.log(`[dry-run] ${path.relative(iconsRoot, dir)}`);
    return;
  }

  fs.writeFileSync(pngPath, knocked);
  fs.writeFileSync(path.join(dir, 'icon.webp'), webpBuf);
  console.log(`updated ${path.relative(iconsRoot, dir)}`);
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
    await processIconDir(dir);
  }

  console.log(`Done (${dirs.length} dirs scanned).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
