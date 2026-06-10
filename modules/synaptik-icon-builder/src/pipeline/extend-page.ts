import fs from 'node:fs';
import { captureWebsite } from '../adapters/playwright-capture.js';
import { extractPaletteFromScreenshotsDir } from '../adapters/image-palette.js';
import {
  listAnalyzeScreenshotPaths,
  visionJsonCompletion,
} from '../adapters/vision/index.js';
import { fileExists, readJsonFile, writeJsonFile } from '../fs-json.js';
import {
  getPageCapturePaths,
  slugify,
  type SessionPaths,
} from '../paths.js';
import {
  CaptureReportSchema,
  ContentBlockSchema,
  ContentCardsFileSchema,
  SessionManifestSchema,
  StyleDNASchema,
  MVP_DEFAULTS,
  type ContentBlock,
} from '../types/index.js';
import {
  loadContentBlocks,
  writeContentFromBlocks,
} from './content-structure.js';
import { runConcepts } from './concepts.js';
import { upsertManifestPage } from './manifest-pages.js';
import { mergeContentBlocks, namespaceBlocksForPage } from '../utils/merge-content.js';
import {
  ensureUniqueBlockAndCardIds,
  slugifyBlockOrCardId,
} from '../utils/ensure-unique-content.js';
import { pageSlugFromUrl, sameOrigin } from '../utils/page-url.js';

const EXTEND_STRUCTURE_SYSTEM = `You analyze ONE additional page of a website for icon generation.

The session already has blocks/cards from other pages. Return ONLY new blocks found on THIS page.

Return JSON only:
{
  "blocks": [
    {
      "id": "kebab-id",
      "title": "Block section title",
      "description": "optional block context",
      "cards": [
        { "id": "kebab-id", "title": "Card heading", "description": "Card body", "sourceRegion": "optional" }
      ]
    }
  ]
}

Rules:
- Do NOT duplicate existing block titles or card titles from the "Existing structure" list.
- BLOCK = large section (h2-level). CARD = item needing its own icon.
- Respect maxBlocks and maxCardsPerBlock.
- Use the site language for titles.
- Prefer DOM draft when it lists real inner cards.`;

export interface ExtendPageResult {
  pageSlug: string;
  addedBlocks: number;
  addedCards: number;
  newCardIds: string[];
}

export async function runExtendPage(
  paths: SessionPaths,
  pageUrl: string,
  opts?: { maxBlocks?: number; maxCardsPerBlock?: number },
): Promise<ExtendPageResult> {
  if (!fileExists(paths.styleDna)) {
    throw new Error('Style DNA missing. Run full analysis first.');
  }
  if (!fileExists(paths.iconStyleBible)) {
    throw new Error('icon-style-bible.json missing. Run icon-bible or full analysis first.');
  }

  readJsonFile(paths.styleDna, StyleDNASchema);

  const manifest = readJsonFile(paths.manifest, SessionManifestSchema);
  const baseUrl = manifest.sourceUrl;
  if (!baseUrl) {
    throw new Error('Session has no sourceUrl. Cannot verify same site.');
  }
  if (!sameOrigin(baseUrl, pageUrl)) {
    throw new Error(
      `URL must be the same site as the session (${baseUrl}). Different host is not allowed.`,
    );
  }

  const pageSlug = pageSlugFromUrl(pageUrl);
  const { screenshotsDir, captureReport } = getPageCapturePaths(paths.sessionId, pageSlug);
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const report = await captureWebsite({ url: pageUrl, screenshotsDir });
  try {
    const paletteFromImage = await extractPaletteFromScreenshotsDir(screenshotsDir);
    if (paletteFromImage.length > 0) report.paletteFromImage = paletteFromImage;
  } catch {
    // optional
  }
  writeJsonFile(captureReport, CaptureReportSchema.parse(report));

  const maxBlocks = opts?.maxBlocks ?? MVP_DEFAULTS.maxBlocks;
  const maxCardsPerBlock = opts?.maxCardsPerBlock ?? MVP_DEFAULTS.maxCardsPerBlock;

  const beforeCards = fileExists(paths.contentCards)
    ? readJsonFile(paths.contentCards, ContentCardsFileSchema).cards
    : [];
  const beforeIds = new Set(beforeCards.map((c) => c.id));

  const existing = loadContentBlocks(paths);
  const existingSummary = existing
    .map(
      (b) =>
        `block: ${b.title} (${b.id}) — cards: ${b.cards.map((c) => c.title).join(', ')}`,
    )
    .join('\n');

  const domJson = report.domStructure
    ? JSON.stringify(report.domStructure, null, 2)
    : '(none)';

  const shots = listAnalyzeScreenshotPaths(screenshotsDir);
  if (shots.length === 0) throw new Error('No screenshots for page capture.');

  const raw = await visionJsonCompletion<{
    blocks: Array<{
      id: string;
      title: string;
      description?: string;
      cards: Array<{
        id: string;
        title: string;
        description?: string;
        sourceRegion?: string;
      }>;
    }>;
  }>(
    EXTEND_STRUCTURE_SYSTEM,
    `New page URL: ${pageUrl}
Page title: ${report.pageTitle ?? 'n/a'}
Max NEW blocks: ${maxBlocks}
Max cards per block: ${maxCardsPerBlock}

Existing structure (do not duplicate):
${existingSummary || '(none)'}

DOM draft:
${domJson}

Text sample:
${report.extractedTextSample ?? ''}`,
    shots,
  );

  let newBlocks: ContentBlock[] = ensureUniqueBlockAndCardIds(
    raw.blocks.slice(0, maxBlocks).map((b) => ({
      id: slugifyBlockOrCardId(b.id, b.title, 'block'),
      title: b.title,
      description: b.description,
      cards: b.cards.slice(0, maxCardsPerBlock).map((c) => ({
        id: slugifyBlockOrCardId(c.id, c.title, 'card'),
        title: c.title,
        description: c.description,
        sourceRegion: c.sourceRegion,
      })),
    })),
  );

  const sortStart = existing.length;
  newBlocks = namespaceBlocksForPage(
    newBlocks,
    pageSlug,
    pageUrl,
    report.pageTitle,
    sortStart,
  );

  const merged = mergeContentBlocks(existing, newBlocks);
  const { auditContentStructure, writeStructureAudit } = await import(
    './validate-content-structure.js'
  );
  writeStructureAudit(paths, auditContentStructure(merged));
  writeContentFromBlocks(paths, merged, { maxBlocks: merged.length, maxCardsPerBlock });

  const afterCards = readJsonFile(paths.contentCards, ContentCardsFileSchema).cards;
  const newCardIds = afterCards.filter((c) => !beforeIds.has(c.id)).map((c) => c.id);

  upsertManifestPage(paths, pageUrl, {
    pageTitle: report.pageTitle,
    capturedAt: report.capturedAt,
  });

  if (newCardIds.length > 0) {
    const { runSemanticInterpret } = await import('../semantic/interpret.js');
    await runSemanticInterpret(paths, { cardIds: newCardIds });
    await runConcepts(paths, { cardIds: newCardIds });
  }

  return {
    pageSlug,
    addedBlocks: newBlocks.length,
    addedCards: newCardIds.length,
    newCardIds,
  };
}
