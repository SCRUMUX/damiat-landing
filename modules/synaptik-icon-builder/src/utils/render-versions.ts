import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import { AssetMetaSchema, IconQualityWarningSchema } from '../types/index.js';
import type { AssetMeta } from '../types/index.js';

const VERSIONS_DIR = 'versions';
const INDEX_FILE = 'index.json';

export const RenderVersionEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  conceptId: z.string().optional(),
  falSeed: z.number().int().optional(),
  promptHash: z.string().optional(),
  failedQa: z.boolean().optional(),
  qualityWarnings: z.array(IconQualityWarningSchema).optional(),
});

export type RenderVersionEntry = z.infer<typeof RenderVersionEntrySchema>;

export const RenderVersionsIndexSchema = z.object({
  activeVersionId: z.string().min(1),
  versions: z.array(RenderVersionEntrySchema),
});

export type RenderVersionsIndex = z.infer<typeof RenderVersionsIndexSchema>;

function versionsRoot(renderDir: string): string {
  return path.join(renderDir, VERSIONS_DIR);
}

function indexPath(renderDir: string): string {
  return path.join(versionsRoot(renderDir), INDEX_FILE);
}

function versionDir(renderDir: string, versionId: string): string {
  return path.join(versionsRoot(renderDir), versionId);
}

function copyRenderFiles(fromDir: string, toDir: string): void {
  fs.mkdirSync(toDir, { recursive: true });
  for (const file of ['icon.png', 'icon.webp', 'meta.json'] as const) {
    const src = path.join(fromDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(toDir, file));
    }
  }
}

function metaToVersionEntry(meta: AssetMeta, versionId: string, createdAt: string): RenderVersionEntry {
  return RenderVersionEntrySchema.parse({
    id: versionId,
    createdAt,
    conceptId: meta.conceptId,
    falSeed: meta.falSeed,
    promptHash: meta.promptHash,
    failedQa: meta.failedQa,
    qualityWarnings: meta.qualityWarnings,
  });
}

/** Ensure versions index exists; seed from current root render if legacy layout. */
export function ensureRenderVersionsIndex(renderDir: string): RenderVersionsIndex {
  const rootPng = path.join(renderDir, 'icon.png');
  const metaPath = path.join(renderDir, 'meta.json');
  const idxFile = indexPath(renderDir);

  if (fs.existsSync(idxFile)) {
    return readJsonFile(idxFile, RenderVersionsIndexSchema);
  }

  if (!fs.existsSync(rootPng) || !fs.existsSync(metaPath)) {
    return RenderVersionsIndexSchema.parse({
      activeVersionId: 'none',
      versions: [],
    });
  }

  const meta = readJsonFile(metaPath, AssetMetaSchema);
  const createdAt = new Date().toISOString();
  const versionId = `v-${Date.parse(createdAt)}`;
  const vDir = versionDir(renderDir, versionId);
  copyRenderFiles(renderDir, vDir);

  const entry = metaToVersionEntry(meta, versionId, createdAt);
  const index = RenderVersionsIndexSchema.parse({
    activeVersionId: versionId,
    versions: [entry],
  });
  writeJsonFile(idxFile, index);
  return index;
}

/** Move current root render into versions/ before overwriting. */
export function archiveCurrentRender(renderDir: string): string | null {
  const rootPng = path.join(renderDir, 'icon.png');
  if (!fs.existsSync(rootPng)) return null;

  const index = ensureRenderVersionsIndex(renderDir);
  const createdAt = new Date().toISOString();
  const versionId = `v-${Date.now()}`;
  const vDir = versionDir(renderDir, versionId);
  copyRenderFiles(renderDir, vDir);

  const meta = readJsonFile(path.join(vDir, 'meta.json'), AssetMetaSchema);
  const entry = metaToVersionEntry(meta, versionId, createdAt);

  const exists = index.versions.some((v) => v.id === versionId);
  const versions = exists ? index.versions : [...index.versions, entry];

  writeJsonFile(indexPath(renderDir), {
    activeVersionId: index.activeVersionId,
    versions,
  });

  return versionId;
}

export function registerNewActiveVersion(renderDir: string, meta: AssetMeta): RenderVersionEntry {
  const idxFile = indexPath(renderDir);
  const index: RenderVersionsIndex = fs.existsSync(idxFile)
    ? readJsonFile(idxFile, RenderVersionsIndexSchema)
    : { activeVersionId: '', versions: [] };
  const createdAt = new Date().toISOString();
  const versionId = `v-${Date.now()}`;
  const vDir = versionDir(renderDir, versionId);
  copyRenderFiles(renderDir, vDir);

  const entry = metaToVersionEntry(meta, versionId, createdAt);
  const versions = [...index.versions.filter((v) => v.id !== versionId), entry].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );

  writeJsonFile(indexPath(renderDir), {
    activeVersionId: versionId,
    versions,
  });
  return entry;
}

export function listRenderVersions(renderDir: string): RenderVersionsIndex {
  const index = ensureRenderVersionsIndex(renderDir);
  const versions = index.versions.filter((v) =>
    fs.existsSync(path.join(versionDir(renderDir, v.id), 'icon.png')),
  );
  return { activeVersionId: index.activeVersionId, versions };
}

export function setActiveRenderVersion(renderDir: string, versionId: string): RenderVersionEntry {
  const index = ensureRenderVersionsIndex(renderDir);
  const vDir = versionDir(renderDir, versionId);
  const png = path.join(vDir, 'icon.png');
  if (!fs.existsSync(png)) {
    throw new Error(`Render version not found: ${versionId}`);
  }

  copyRenderFiles(vDir, renderDir);

  const entry = index.versions.find((v) => v.id === versionId);
  if (!entry) {
    throw new Error(`Unknown render version: ${versionId}`);
  }

  writeJsonFile(indexPath(renderDir), {
    activeVersionId: versionId,
    versions: index.versions,
  });

  return entry;
}

export function versionPreviewPath(
  sessionId: string,
  cardId: string,
  versionId: string,
): string {
  return `/api/session/${sessionId}/preview/${cardId}/versions/${versionId}/icon.png`;
}
