import { fileExists, readJsonFile } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import {
  ContentCardsFileSchema,
  ContentStructureFileSchema,
} from '../types/index.js';
import { ensureUniqueBlockAndCardIds } from '../utils/ensure-unique-content.js';
import {
  auditContentStructure,
  writeStructureAudit,
} from './validate-content-structure.js';
import { loadContentBlocks, writeContentFromBlocks } from './content-structure.js';

export interface RepairStructureResult {
  blocks: number;
  cards: number;
  warnings: string[];
  repaired: boolean;
}

export function runRepairStructure(paths: SessionPaths): RepairStructureResult {
  if (!fileExists(paths.contentStructure) && !fileExists(paths.contentCards)) {
    throw new Error('No content-structure.json or content-cards.json in session.');
  }

  let blocks = loadContentBlocks(paths);
  const beforeAudit = auditContentStructure(blocks);
  const normalized = ensureUniqueBlockAndCardIds(blocks);
  const afterAudit = auditContentStructure(normalized);

  writeContentFromBlocks(paths, normalized, {
    maxBlocks: normalized.length,
    maxCardsPerBlock: Math.max(1, ...normalized.map((b) => b.cards.length)),
  });

  writeStructureAudit(paths, afterAudit);

  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const structure = readJsonFile(paths.contentStructure, ContentStructureFileSchema);

  return {
    blocks: structure.blocks.length,
    cards: cards.length,
    warnings: [...beforeAudit.warnings, ...afterAudit.warnings],
    repaired:
      beforeAudit.duplicateBlockIds.length > 0 ||
      beforeAudit.duplicateCardIds.length > 0 ||
      normalized.some((b, i) => b.id !== blocks[i]?.id),
  };
}
