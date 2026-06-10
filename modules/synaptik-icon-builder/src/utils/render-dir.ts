import fs from 'node:fs';
import path from 'node:path';
import { slugify } from '../paths.js';
import { contentIdFromTitle } from './ensure-unique-content.js';

/** Unique folder name under renders/ for a card (avoids slug collisions). */
export function resolveRenderDirName(
  rendersDir: string,
  cardId: string,
  reserved?: Set<string>,
): string {
  const base = slugify(cardId) || contentIdFromTitle(cardId, 'render');
  let name = base;
  let n = 2;

  const taken = new Set(reserved);
  if (fs.existsSync(rendersDir)) {
    for (const entry of fs.readdirSync(rendersDir)) {
      taken.add(entry);
    }
  }

  while (taken.has(name)) {
    name = `${base}-${n}`;
    n++;
  }
  return name;
}

export function findRenderDirByCardId(
  rendersDir: string,
  cardId: string,
): string | null {
  if (!fs.existsSync(rendersDir)) return null;
  for (const name of fs.readdirSync(rendersDir)) {
    const metaPath = path.join(rendersDir, name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const raw = fs.readFileSync(metaPath, 'utf8');
      const meta = JSON.parse(raw) as { cardId?: string };
      if (meta.cardId === cardId) {
        return path.join(rendersDir, name);
      }
    } catch {
      // skip
    }
  }
  const fallback = path.join(rendersDir, slugify(cardId));
  if (fs.existsSync(path.join(fallback, 'icon.png'))) return fallback;
  return null;
}
