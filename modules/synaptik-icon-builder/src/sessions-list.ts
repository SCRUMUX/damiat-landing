import fs from 'node:fs';
import path from 'node:path';
import { fileExists, readJsonFile } from './fs-json.js';
import {
  getGeneratedIconDir,
  getGeneratedIconsRoot,
  getSessionPaths,
  getSessionsRoot,
} from './paths.js';
import { resolveCatalogStatus, type CatalogStatus } from './utils/catalog-status.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  ContentStructureFileSchema,
  SelectionsFileSchema,
  SessionManifestSchema,
  StyleDNASchema,
} from './types/index.js';
import type { SessionPaths } from './paths.js';
import { slugify } from './paths.js';
import { getIconSetStyle } from './icon-set-styles/index.js';
import { readIconStyleBible, resolveSessionIconSetStyleId } from './pipeline/icon-style-bible.js';
import { loadManifestPages } from './pipeline/manifest-pages.js';
import type { ContentStructureAudit } from './pipeline/validate-content-structure.js';
import { auditContentStructure } from './pipeline/validate-content-structure.js';
import { loadContentBlocks } from './pipeline/content-structure.js';
import type { SessionPageEntry } from './types/index.js';

export interface SessionSummary {
  sessionId: string;
  projectSlug: string;
  sourceUrl?: string;
  createdAt: string;
  styleLabel?: string;
  cardCount: number;
  renderedCount: number;
  hasStyleDna: boolean;
}

export interface IconStatusEntry {
  previewUrl: string;
  publishedUrl?: string;
  conceptId?: string;
  promptHash?: string;
  iconSetStyleId?: string;
  renderedAt?: string;
  publishedAt?: string;
  publishedConceptId?: string;
  publishedPromptHash?: string;
  catalogStatus: CatalogStatus;
  failedQa?: boolean;
  qualityWarnings?: string[];
}

export interface SessionUiState {
  sessionId: string;
  sourceUrl?: string;
  dna: ReturnType<typeof StyleDNASchema.parse>;
  cards: ReturnType<typeof ContentCardsFileSchema.parse>['cards'];
  blocks?: ReturnType<typeof ContentStructureFileSchema.parse>['blocks'];
  selections: Array<{ cardId: string; conceptId: string }>;
  conceptCardIds: string[];
  previews: Record<string, { previewUrl: string }>;
  iconStatus: Record<string, IconStatusEntry>;
  renderMeta: Record<
    string,
    {
      failedQa?: boolean;
      qualityWarnings?: string[];
      promptHash?: string;
      iconSetStyleId?: string;
    }
  >;
  publishedCardIds: string[];
  pages: SessionPageEntry[];
  iconStyleBlock?: string;
  iconSetStyleId?: string;
  iconSetStyleLabel?: string;
  progress: { step: number; analyzed: boolean };
  structureAudit?: ContentStructureAudit;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    u.hash = '';
    let p = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.origin}${p}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

function countRendered(paths: SessionPaths): number {
  if (!fs.existsSync(paths.rendersDir)) return 0;
  let n = 0;
  for (const name of fs.readdirSync(paths.rendersDir)) {
    if (fs.existsSync(path.join(paths.rendersDir, name, 'icon.png'))) n++;
  }
  return n;
}

export function listSessions(): SessionSummary[] {
  try {
    const root = getSessionsRoot();
    if (!fs.existsSync(root)) return [];

    const out: SessionSummary[] = [];

    for (const sessionId of fs.readdirSync(root)) {
      try {
        const paths = getSessionPaths(sessionId);
        if (!fileExists(paths.manifest) || !fileExists(paths.styleDna)) continue;

        const manifest = readJsonFile(paths.manifest, SessionManifestSchema);
        const dna = readJsonFile(paths.styleDna, StyleDNASchema);
        const cards = fileExists(paths.contentCards)
          ? readJsonFile(paths.contentCards, ContentCardsFileSchema).cards
          : [];

        out.push({
          sessionId,
          projectSlug: dna.projectSlug,
          sourceUrl: manifest.sourceUrl,
          createdAt: manifest.createdAt,
          styleLabel: dna.styleLabel,
          cardCount: cards.length,
          renderedCount: countRendered(paths),
          hasStyleDna: true,
        });
      } catch (e) {
        console.warn(
          `[synaptik] Skip session "${sessionId}":`,
          e instanceof Error ? e.message : String(e),
        );
      }
    }

    return out.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (e) {
    console.warn(
      '[synaptik] listSessions failed:',
      e instanceof Error ? e.message : String(e),
    );
    return [];
  }
}

export function findSessionByUrl(url: string): SessionSummary | undefined {
  const norm = normalizeUrl(url);
  return listSessions().find(
    (s) => s.sourceUrl && normalizeUrl(s.sourceUrl) === norm,
  );
}

function getPublishedCardIds(paths: SessionPaths): string[] {
  const published = new Set<string>();
  if (!fs.existsSync(paths.rendersDir)) return [];

  for (const name of fs.readdirSync(paths.rendersDir)) {
    const metaPath = path.join(paths.rendersDir, name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (meta.cardId && meta.sessionId === paths.sessionId && meta.publishedAt) {
      published.add(meta.cardId);
    }
  }

  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const projectDir = path.join(getGeneratedIconsRoot(), dna.projectSlug);
  if (!fs.existsSync(projectDir)) return [...published];

  for (const iconSlug of fs.readdirSync(projectDir)) {
    const metaPath = path.join(projectDir, iconSlug, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (meta.sessionId === paths.sessionId && meta.cardId) {
      published.add(meta.cardId);
    }
  }

  return [...published];
}

export function buildSessionUiState(sessionId: string): SessionUiState {
  const paths = getSessionPaths(sessionId);
  if (!fileExists(paths.styleDna)) {
    throw new Error(`Session "${sessionId}" has no Style DNA. Run analysis first.`);
  }

  const manifest = fileExists(paths.manifest)
    ? readJsonFile(paths.manifest, SessionManifestSchema)
    : null;
  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const { cards } = fileExists(paths.contentCards)
    ? readJsonFile(paths.contentCards, ContentCardsFileSchema)
    : { cards: [] };

  let blocks: SessionUiState['blocks'];
  if (fileExists(paths.contentStructure)) {
    blocks = readJsonFile(paths.contentStructure, ContentStructureFileSchema).blocks;
  }

  const selections = fileExists(paths.selections)
    ? readJsonFile(paths.selections, SelectionsFileSchema).selections.map((s) => ({
        cardId: s.cardId,
        conceptId: s.conceptId,
      }))
    : [];

  const conceptCardIds: string[] = [];
  for (const card of cards) {
    const conceptFile = path.join(paths.conceptsDir, `${slugify(card.id)}.json`);
    if (fs.existsSync(conceptFile)) {
      conceptCardIds.push(card.id);
    }
  }

  const previews: Record<string, { previewUrl: string }> = {};
  const iconStatus: Record<string, IconStatusEntry> = {};
  const renderMeta: SessionUiState['renderMeta'] = {};
  const publishedInCatalog = new Set<string>();

  const projectDir = path.join(getGeneratedIconsRoot(), dna.projectSlug);
  if (fs.existsSync(projectDir)) {
    for (const iconSlug of fs.readdirSync(projectDir)) {
      const metaPath = path.join(projectDir, iconSlug, 'meta.json');
      if (!fs.existsSync(metaPath)) continue;
      const meta = readJsonFile(metaPath, AssetMetaSchema);
      if (meta.sessionId === sessionId && meta.cardId) {
        publishedInCatalog.add(meta.cardId);
      }
    }
  }

  if (fs.existsSync(paths.rendersDir)) {
    for (const name of fs.readdirSync(paths.rendersDir)) {
      const metaPath = path.join(paths.rendersDir, name, 'meta.json');
      if (!fs.existsSync(metaPath)) continue;
      const meta = readJsonFile(metaPath, AssetMetaSchema);
      if (!meta.cardId) continue;
      const png = path.join(paths.rendersDir, name, 'icon.png');
      if (!fs.existsSync(png)) continue;

      const previewUrl = `/api/session/${sessionId}/preview/${meta.cardId}/icon.png`;
      previews[meta.cardId] = { previewUrl };

      const renderedAt = new Date(fs.statSync(png).mtimeMs).toISOString();
      const iconSlug = meta.iconSlug ?? name;
      let publishedMeta: ReturnType<typeof AssetMetaSchema.parse> | null = null;
      const catalogMetaPath = path.join(
        getGeneratedIconDir(dna.projectSlug, iconSlug),
        'meta.json',
      );
      if (fs.existsSync(catalogMetaPath)) {
        publishedMeta = readJsonFile(catalogMetaPath, AssetMetaSchema);
      }

      const hasCatalogEntry =
        publishedInCatalog.has(meta.cardId) ||
        Boolean(publishedMeta?.publishedAt && publishedMeta.sessionId === sessionId);

      const catalogStatus = resolveCatalogStatus(
        hasCatalogEntry,
        {
          conceptId: meta.conceptId,
          promptHash: meta.promptHash,
          publishedAt: meta.publishedAt,
        },
        publishedMeta
          ? {
              conceptId: publishedMeta.conceptId,
              promptHash: publishedMeta.promptHash,
              publishedAt: publishedMeta.publishedAt,
            }
          : null,
      );

      const publishedUrl =
        hasCatalogEntry && fs.existsSync(path.join(getGeneratedIconDir(dna.projectSlug, iconSlug), 'icon.png'))
          ? `/api/session/${sessionId}/published/${meta.cardId}/icon.png`
          : undefined;

      iconStatus[meta.cardId] = {
        previewUrl,
        publishedUrl,
        conceptId: meta.conceptId,
        promptHash: meta.promptHash,
        iconSetStyleId: meta.iconSetStyleId,
        renderedAt,
        publishedAt: publishedMeta?.publishedAt,
        publishedConceptId: publishedMeta?.conceptId,
        publishedPromptHash: publishedMeta?.promptHash,
        catalogStatus,
        ...(meta.failedQa ? { failedQa: true } : {}),
        ...(meta.qualityWarnings?.length
          ? { qualityWarnings: meta.qualityWarnings }
          : {}),
      };

      renderMeta[meta.cardId] = {
        promptHash: meta.promptHash,
        iconSetStyleId: meta.iconSetStyleId,
        ...(meta.failedQa ? { failedQa: true } : {}),
        ...(meta.qualityWarnings?.length
          ? { qualityWarnings: meta.qualityWarnings }
          : {}),
      };
    }
  }

  const publishedCardIds = getPublishedCardIds(paths);
  const renderedCount = Object.keys(previews).length;

  let step = 1;
  if (dna) step = 2;
  if (renderedCount > 0) step = 3;
  if (publishedCardIds.length > 0) step = 4;

  const bible = readIconStyleBible(paths);
  const iconSetStyleId = resolveSessionIconSetStyleId(paths);
  const iconSetStyleLabel = getIconSetStyle(iconSetStyleId).labelRu;

  let structureAudit: ContentStructureAudit | undefined;
  const auditPath = path.join(
    path.dirname(paths.contentStructure),
    'content-structure.audit.json',
  );
  if (fileExists(auditPath)) {
    structureAudit = readJsonFile(auditPath) as ContentStructureAudit;
  } else if (blocks?.length) {
    try {
      structureAudit = auditContentStructure(loadContentBlocks(paths));
    } catch {
      // ignore
    }
  }

  return {
    sessionId,
    sourceUrl: manifest?.sourceUrl,
    dna,
    cards,
    blocks,
    selections,
    conceptCardIds,
    previews,
    iconStatus,
    renderMeta,
    publishedCardIds,
    pages: loadManifestPages(paths),
    iconStyleBlock: bible?.styleBlock,
    iconSetStyleId,
    iconSetStyleLabel,
    progress: { step, analyzed: true },
    structureAudit,
  };
}
