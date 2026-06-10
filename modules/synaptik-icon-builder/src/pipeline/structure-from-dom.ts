import { slugify, type SessionPaths } from '../paths.js';
import {
  CaptureReportSchema,
  ContentBlockSchema,
  type ContentBlock,
  type DomStructure,
} from '../types/index.js';
import { readJsonFile } from '../fs-json.js';
import { ensureUniqueBlockAndCardIds, slugifyBlockOrCardId } from '../utils/ensure-unique-content.js';

export function blocksFromDomStructure(
  dom: DomStructure,
  sourcePageUrl?: string,
  sourcePageTitle?: string,
): ContentBlock[] {
  const blocks: ContentBlock[] = dom.blocks.map((b, i) => {
    const blockId = slugifyBlockOrCardId(undefined, b.title, 'block');
    const cards = (b.cards ?? []).map((c) => ({
      id: slugifyBlockOrCardId(undefined, c.title, 'card'),
      title: c.title,
      description: c.description,
      sourceRegion: undefined as string | undefined,
    }));
    return ContentBlockSchema.parse({
      id: blockId || `block-${i}`,
      title: b.title,
      cards,
      sourcePageUrl,
      sourcePageTitle,
      sortOrder: i,
    });
  });
  return ensureUniqueBlockAndCardIds(blocks);
}

export function loadDomBlocksFromSession(paths: SessionPaths): ContentBlock[] {
  const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
  if (!capture.domStructure?.blocks?.length) return [];
  return blocksFromDomStructure(
    capture.domStructure,
    capture.sourceUrl,
    capture.pageTitle,
  );
}

export function domHasUsableStructure(dom: DomStructure | undefined): boolean {
  if (!dom?.blocks?.length) return false;
  return dom.blocks.some((b) => (b.cards?.length ?? 0) > 0);
}

/** Merge vision blocks with DOM: prefer DOM nesting when DOM has cards. */
export function mergeVisionWithDomBlocks(
  visionBlocks: ContentBlock[],
  domBlocks: ContentBlock[],
): ContentBlock[] {
  if (!domHasUsableStructure({ blocks: domBlocks.map((b) => ({ title: b.title, cards: b.cards })) })) {
    return visionBlocks;
  }

  const visionByTitle = new Map(
    visionBlocks.map((b) => [b.title.trim().toLowerCase(), b]),
  );

  const merged: ContentBlock[] = domBlocks.map((domBlock, i) => {
    const key = domBlock.title.trim().toLowerCase();
    const vision = visionByTitle.get(key);
    const cards = domBlock.cards.length > 0 ? domBlock.cards : (vision?.cards ?? []);
    return ContentBlockSchema.parse({
      id: domBlock.id,
      title: domBlock.title,
      description: vision?.description ?? domBlock.description,
      cards: cards.map((c) => ({
        ...c,
        description: c.description ?? vision?.cards.find((v) => v.title === c.title)?.description,
      })),
      sourcePageUrl: domBlock.sourcePageUrl ?? vision?.sourcePageUrl,
      sourcePageTitle: domBlock.sourcePageTitle ?? vision?.sourcePageTitle,
      sortOrder: i,
    });
  });

  for (const vb of visionBlocks) {
    const key = vb.title.trim().toLowerCase();
    if (!merged.some((m) => m.title.trim().toLowerCase() === key)) {
      merged.push({ ...vb, sortOrder: merged.length });
    }
  }

  return ensureUniqueBlockAndCardIds(merged);
}
