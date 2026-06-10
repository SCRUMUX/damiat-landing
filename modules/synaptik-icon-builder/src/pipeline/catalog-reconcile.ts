import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import {
  getGeneratedIconsRoot,
  getRegistryPath,
  slugify,
  type SessionPaths,
} from '../paths.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  RegistrySchema,
  type ContentCard,
} from '../types/index.js';

export interface ReconcileSessionResult {
  renderCardIdsUpdated: string[];
  orphanRenderDirs: string[];
}

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchCardBySourceTitle(
  cards: ContentCard[],
  sourceCard: string | undefined,
): ContentCard | undefined {
  if (!sourceCard?.trim()) return undefined;
  const norm = normalizeTitle(sourceCard);
  return cards.find((c) => normalizeTitle(c.title) === norm);
}

/** Fix render meta.cardId when structure ids changed but titles match. */
export function reconcileSessionRenders(paths: SessionPaths): ReconcileSessionResult {
  const result: ReconcileSessionResult = {
    renderCardIdsUpdated: [],
    orphanRenderDirs: [],
  };

  if (!fs.existsSync(paths.contentCards) || !fs.existsSync(paths.rendersDir)) {
    return result;
  }

  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const cardIds = new Set(cards.map((c) => c.id));

  for (const name of fs.readdirSync(paths.rendersDir)) {
    const renderDir = path.join(paths.rendersDir, name);
    const metaPath = path.join(renderDir, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;

    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (!meta.cardId || cardIds.has(meta.cardId)) continue;

    const matched = matchCardBySourceTitle(cards, meta.sourceCard);
    if (matched) {
      const updated = AssetMetaSchema.parse({ ...meta, cardId: matched.id });
      writeJsonFile(metaPath, updated);
      result.renderCardIdsUpdated.push(`${meta.cardId}→${matched.id}`);
      continue;
    }
    result.orphanRenderDirs.push(name);
  }

  return result;
}

/** Remove duplicate registry rows for same projectSlug + meta.cardId (keep latest publishedAt). */
export function dedupeRegistryByCardId(projectSlug?: string): number {
  const registryPath = getRegistryPath();
  if (!fs.existsSync(registryPath)) return 0;

  const registry = readJsonFile(registryPath, RegistrySchema);
  const root = getGeneratedIconsRoot();
  const other = projectSlug
    ? registry.icons.filter((i) => i.projectSlug !== projectSlug)
    : [];
  const scoped = projectSlug
    ? registry.icons.filter((i) => i.projectSlug === projectSlug)
    : registry.icons;

  const byKey = new Map<string, (typeof registry.icons)[number] & { _at: number }>();

  for (const entry of scoped) {
    const metaPath = path.join(root, entry.relativePath, 'meta.json');
    let cardId = entry.iconSlug;
    let publishedAt = 0;
    if (fs.existsSync(metaPath)) {
      const meta = readJsonFile(metaPath, AssetMetaSchema);
      if (meta.cardId) cardId = meta.cardId;
      if (meta.publishedAt) publishedAt = Date.parse(meta.publishedAt) || 0;
    }

    const key = `${entry.projectSlug}::${cardId}`;
    const prev = byKey.get(key);
    if (!prev || publishedAt >= prev._at) {
      byKey.set(key, { ...entry, _at: publishedAt });
    }
  }

  const deduped = [...byKey.values()].map(({ _at: _unused, ...e }) => e);
  const icons = [...other, ...deduped];
  const removed = registry.icons.length - icons.length;
  if (removed > 0) {
    writeJsonFile(registryPath, { version: 1, icons });
  }
  return removed;
}

export function reconcileAfterStructureWrite(paths: SessionPaths): ReconcileSessionResult {
  return reconcileSessionRenders(paths);
}
