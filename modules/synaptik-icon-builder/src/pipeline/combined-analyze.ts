import {
  listAnalyzeScreenshotPaths,
  visionJsonCompletion,
} from '../adapters/vision/index.js';
import { readJsonFile, writeJsonFile, fileExists } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  CaptureReportSchema,
  ContentBlockSchema,
  ContentCardsFileSchema,
  ContentStructureFileSchema,
  StyleDNASchema,
  MVP_DEFAULTS,
  type StyleDNA,
  type ContentBlock,
} from '../types/index.js';
import type { SessionManifest } from '../types/index.js';
import { annotateBlocksWithPage, writeContentFromBlocks } from './content-structure.js';
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

const COMBINED_SYSTEM = `You analyze a marketing website for an icon generation pipeline. Output JSON only:

{
  "styleDna": {
    "industry": string,
    "siteVisualStyle": "short English: how the WEBSITE looks (reference only, never for icons)",
    "materials": string[],
    "palette": string[],
    "lighting": string,
    "background": "white",
    "brandCharacter": string,
    "styleLabel": string
  },
  "blocks": [
    {
      "id": "kebab-id",
      "title": "BLOCK: large section title (h2-level)",
      "description": "optional section context",
      "cards": [
        {
          "id": "kebab-id",
          "title": "CARD: short inner heading",
          "description": "CARD: 1-2 sentences — NOT the block title"
        }
      ]
    }
  ]
}

BLOCK = major section (e.g. product name). CARD = small feature inside the block (icon target).
Do not list block titles as cards. background must be "white".
siteVisualStyle describes the marketing site only — icon render style is chosen separately, never photorealistic for icons.`;

export async function runCombinedAnalyze(
  paths: SessionPaths,
  opts: { force?: boolean; slug?: string; maxBlocks?: number; maxCardsPerBlock?: number },
): Promise<StyleDNA> {
  if (fileExists(paths.styleDna) && !opts.force) {
    throw new Error('Style DNA already exists. Use --force to regenerate (dev only).');
  }

  const maxBlocks = opts.maxBlocks ?? MVP_DEFAULTS.maxBlocks;
  const maxCardsPerBlock = opts.maxCardsPerBlock ?? MVP_DEFAULTS.maxCardsPerBlock;
  const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
  const manifest = readJsonFile(paths.manifest) as SessionManifest;
  const shots = listAnalyzeScreenshotPaths(paths.screenshotsDir);
  if (shots.length === 0) throw new Error('No screenshots. Run: synaptik capture');

  const domJson = capture.domStructure
    ? JSON.stringify(capture.domStructure, null, 2)
    : '(none)';

  const raw = await visionJsonCompletion<{
    styleDna: {
      industry: string;
      siteVisualStyle: string;
      materials: string[];
      palette: string[];
      lighting: string;
      background: string;
      brandCharacter?: string;
      styleLabel?: string;
    };
    blocks: Array<{
      id: string;
      title: string;
      description?: string;
      cards: Array<{ id: string; title: string; description?: string }>;
    }>;
  }>(
    COMBINED_SYSTEM,
    `URL: ${capture.sourceUrl ?? 'screenshots'}
Page title: ${capture.pageTitle ?? 'n/a'}
Max blocks: ${maxBlocks}
Max cards per block: ${maxCardsPerBlock}
DOM colors: ${(capture.dominantColors ?? []).join(', ')}
Image palette: ${(capture.paletteFromImage ?? []).join(', ')}
Fonts: ${(capture.fontFamilies ?? []).join(', ')}

DOM draft:
${domJson}

Text sample:
${capture.extractedTextSample ?? ''}`,
    shots,
  );

  const projectSlug = slugify(
    opts.slug ?? manifest.projectSlug ?? raw.styleDna.industry,
  );

  const dna = StyleDNASchema.parse({
    projectSlug,
    industry: raw.styleDna.industry,
    rendering: 'site-reference-only',
    siteVisualStyle: raw.styleDna.siteVisualStyle?.trim() || 'marketing site',
    materials: raw.styleDna.materials,
    palette: raw.styleDna.palette,
    lighting: raw.styleDna.lighting,
    background: 'white',
    brandCharacter: raw.styleDna.brandCharacter,
    styleLabel: raw.styleDna.styleLabel ?? projectSlug,
    createdAt: new Date().toISOString(),
  });

  writeJsonFile(paths.styleDna, dna);
  manifest.projectSlug = projectSlug;
  writeJsonFile(paths.manifest, manifest);

  let blocks: ContentBlock[] = raw.blocks.slice(0, maxBlocks).map((b) => ({
    id: slugifyBlockOrCardId(b.id, b.title, 'block'),
    title: b.title,
    description: b.description,
    cards: b.cards.slice(0, maxCardsPerBlock).map((c) => ({
      id: slugifyBlockOrCardId(c.id, c.title, 'card'),
      title: c.title,
      description: c.description,
    })),
  }));
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
  const audit = auditContentStructure(blocks);
  writeStructureAudit(paths, audit);

  writeContentFromBlocks(paths, blocks, { maxBlocks, maxCardsPerBlock });

  const { runIconStyleBible } = await import('./icon-style-bible.js');
  await runIconStyleBible(paths, {
    force: true,
    iconSetStyleId: manifest.iconSetStyleId,
  });

  const { runSemanticInterpret } = await import('../semantic/interpret.js');
  await runSemanticInterpret(paths, {});

  return dna;
}
