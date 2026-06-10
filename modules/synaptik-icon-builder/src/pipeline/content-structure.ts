import {
  listAnalyzeScreenshotPaths,
  visionJsonCompletion,
} from '../adapters/vision/index.js';
import { fileExists, readJsonFile, writeJsonFile } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  ensureUniqueBlockAndCardIds,
  slugifyBlockOrCardId,
} from '../utils/ensure-unique-content.js';
import {
  blocksFromDomStructure,
  domHasUsableStructure,
  mergeVisionWithDomBlocks,
} from './structure-from-dom.js';
import {
  auditContentStructure,
  sanitizeContentStructure,
  writeStructureAudit,
} from './validate-content-structure.js';
import { reconcileAfterStructureWrite } from './catalog-reconcile.js';
import {
  CaptureReportSchema,
  ContentBlockSchema,
  ContentCardsFileSchema,
  ContentStructureFileSchema,
  StyleDNASchema,
  MVP_DEFAULTS,
  type ContentBlock,
  type ContentCard,
} from '../types/index.js';

const STRUCTURE_SYSTEM = `You refine a website content hierarchy for icon generation.

A BLOCK is a large page section (usually h2-level): product area, major feature group.
A CARD is a smaller item INSIDE a block: short heading + 1–2 sentence description. Icons are generated per CARD, not per block.

Return JSON only:
{
  "blocks": [
    {
      "id": "kebab-id",
      "title": "Block section title",
      "description": "optional block context",
      "cards": [
        { "id": "kebab-id", "title": "Card heading", "description": "Card body text", "sourceRegion": "optional" }
      ]
    }
  ]
}

Rules:
- Do NOT put block titles into the cards list.
- Each card needs a distinct id (kebab-case).
- Respect maxBlocks and maxCardsPerBlock limits.
- Use the site language for titles.
- Prefer DOM draft structure when it lists real inner cards.`;

export interface AnalyzeContentOptions {
  maxBlocks?: number;
  maxCardsPerBlock?: number;
}

export function annotateBlocksWithPage(
  blocks: ContentBlock[],
  sourcePageUrl: string,
  sourcePageTitle?: string,
): ContentBlock[] {
  return blocks.map((b, i) =>
    ContentBlockSchema.parse({
      ...b,
      sourcePageUrl,
      sourcePageTitle,
      sortOrder: b.sortOrder ?? i,
    }),
  );
}

export function flattenBlocksToCards(blocks: ContentBlock[]): ContentCard[] {
  const cards: ContentCard[] = [];
  for (const block of blocks) {
    for (const card of block.cards) {
      const id =
        card.id && card.id.length > 0
          ? card.id
          : slugify(card.title) || card.title.slice(0, 64);
      cards.push({
        id,
        title: card.title,
        description: card.description,
        sourceRegion: card.sourceRegion,
        blockId: block.id,
        blockTitle: block.title,
        sourcePageUrl: block.sourcePageUrl,
        sourcePageTitle: block.sourcePageTitle,
        ...(card.skipped ? { skipped: true } : {}),
      });
    }
  }
  return cards;
}

export function writeContentFromBlocks(
  paths: SessionPaths,
  blocks: ContentBlock[],
  limits?: { maxBlocks?: number; maxCardsPerBlock?: number },
): void {
  const normalized = ensureUniqueBlockAndCardIds(blocks);
  const generatedAt = new Date().toISOString();
  writeJsonFile(
    paths.contentStructure,
    ContentStructureFileSchema.parse({
      blocks: normalized,
      maxBlocks: limits?.maxBlocks,
      maxCardsPerBlock: limits?.maxCardsPerBlock,
      generatedAt,
    }),
  );
  const flat = flattenBlocksToCards(normalized);
  writeJsonFile(
    paths.contentCards,
    ContentCardsFileSchema.parse({
      cards: flat,
      maxCards: flat.length,
      generatedAt,
    }),
  );

  reconcileAfterStructureWrite(paths);
}

function legacyFlatCardsToBlocks(cards: ContentCard[]): ContentBlock[] {
  if (cards.length === 0) return [];
  return [
    {
      id: 'general',
      title: 'Features',
      description: 'Legacy flat card list',
      cards: cards.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        sourceRegion: c.sourceRegion,
      })),
    },
  ];
}

export async function runAnalyzeContentStructure(
  paths: SessionPaths,
  opts: AnalyzeContentOptions = {},
): Promise<void> {
  const maxBlocks = opts.maxBlocks ?? MVP_DEFAULTS.maxBlocks;
  const maxCardsPerBlock = opts.maxCardsPerBlock ?? MVP_DEFAULTS.maxCardsPerBlock;

  const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
  const shots = listAnalyzeScreenshotPaths(paths.screenshotsDir);
  if (shots.length === 0) throw new Error('No screenshots. Run: synaptik capture');

  let industry = 'general';
  if (fileExists(paths.styleDna)) {
    const dna = readJsonFile(paths.styleDna, StyleDNASchema);
    industry = dna.industry;
  }

  const domJson = capture.domStructure
    ? JSON.stringify(capture.domStructure, null, 2)
    : '(none)';

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
    STRUCTURE_SYSTEM,
    `Industry: ${industry}
Max blocks: ${maxBlocks}
Max cards per block: ${maxCardsPerBlock}

DOM draft (blocks with nested cards):
${domJson}

Extracted text sample:
${capture.extractedTextSample ?? ''}`,
    shots,
  );

  let blocks: ContentBlock[] = raw.blocks.slice(0, maxBlocks).map((b) => {
    const blockId = slugifyBlockOrCardId(b.id, b.title, 'block');
    const cards = b.cards.slice(0, maxCardsPerBlock).map((c) => ({
      id: slugifyBlockOrCardId(c.id, c.title, 'card'),
      title: c.title,
      description: c.description,
      sourceRegion: c.sourceRegion,
    }));
    return {
      id: blockId,
      title: b.title,
      description: b.description,
      cards,
    };
  });
  blocks = ensureUniqueBlockAndCardIds(blocks);

  if (capture.sourceUrl) {
    blocks = annotateBlocksWithPage(blocks, capture.sourceUrl, capture.pageTitle);
  }

  if (domHasUsableStructure(capture.domStructure)) {
    const domBlocks = blocksFromDomStructure(
      capture.domStructure!,
      capture.sourceUrl,
      capture.pageTitle,
    );
    blocks = mergeVisionWithDomBlocks(blocks, domBlocks);
  }

  blocks = sanitizeContentStructure(blocks);
  writeStructureAudit(paths, auditContentStructure(blocks));

  writeContentFromBlocks(paths, blocks, { maxBlocks, maxCardsPerBlock });
}

export function loadContentBlocks(paths: SessionPaths): ContentBlock[] {
  try {
    const structure = readJsonFile(paths.contentStructure, ContentStructureFileSchema);
    return structure.blocks;
  } catch {
    const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
    return legacyFlatCardsToBlocks(cards);
  }
}
