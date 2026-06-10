import { readJsonFile } from '../fs-json.js';
import type { SessionPaths } from '../paths.js';
import { ContentCardsFileSchema, SelectionsFileSchema } from '../types/index.js';
import { getConceptSetForCard } from './concepts.js';
import { buildPromptForCard } from './build-prompt.js';
import { resolveSessionIconSetStyleId } from './icon-style-bible.js';
import { auditPrompt, type PromptAuditReport } from './prompt-audit.js';
import { scorePrompt, type PromptScore } from './prompt-score.js';
import { readCardSemantic } from '../semantic/interpret.js';
import type { CardSemantic } from '../semantic/types.js';
import type { ConceptLetter } from '../types/index.js';

export interface PromptPreviewResult {
  cardTitle: string;
  cardId: string;
  semantic: CardSemantic | null;
  selectedConcept: { id: ConceptLetter; label: string; visualObject: string };
  sections: { subject: string; style: string; composition: string };
  subjectLine: string;
  stylePresetId: string;
  fullPrompt: string;
  audit: PromptAuditReport;
  score: PromptScore;
}

export function buildPromptPreview(
  paths: SessionPaths,
  cardId: string,
  conceptId?: ConceptLetter,
): PromptPreviewResult {
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const card = cards.find((c) => c.id === cardId);
  if (!card) throw new Error(`Unknown card: ${cardId}`);

  let resolvedConceptId = conceptId;
  if (!resolvedConceptId) {
    const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
    const sel = selections.find((s) => s.cardId === cardId);
    if (!sel) {
      throw new Error(`No concept selected for card "${cardId}".`);
    }
    resolvedConceptId = sel.conceptId;
  }

  const set = getConceptSetForCard(paths, cardId);
  const built = buildPromptForCard(paths, cardId, { conceptId: resolvedConceptId });
  const resolved = set.concepts.find((c) => c.id === resolvedConceptId)!;
  const semantic = readCardSemantic(paths, cardId) ?? null;

  const scoreResult = scorePrompt(built.text, built.visualObject);

  return {
    cardTitle: card.title,
    cardId,
    semantic,
    selectedConcept: {
      id: resolvedConceptId,
      label: resolved.label,
      visualObject: built.visualObject,
    },
    sections: built.sections,
    subjectLine: built.subjectLine,
    stylePresetId: resolveSessionIconSetStyleId(paths),
    fullPrompt: built.text,
    audit: auditPrompt(built.text),
    score: {
      styleCoverage: scoreResult.styleCoverage,
      semanticCoverage: scoreResult.semanticCoverage,
      objectClarity: scoreResult.objectClarity,
      ambiguityRisk: scoreResult.ambiguityRisk,
    },
  };
}
