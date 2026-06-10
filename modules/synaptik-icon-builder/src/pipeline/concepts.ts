import path from 'node:path';
import { visionJsonCompletion } from '../adapters/vision/index.js';
import {
  buildSubjectLine,
  extractVisualObject,
  getIconSetStyle,
  presetConceptGuardrails,
  type IconSetStyleId,
  type IconSetStylePreset,
} from '../icon-set-styles/index.js';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import { readCardSemantic } from '../semantic/interpret.js';
import type { CardSemantic } from '../semantic/types.js';
import { ANTI_PATTERN_PROMPT_RULES, hasAntiPattern } from '../semantic/anti-patterns.js';
import {
  ContentCardsFileSchema,
  IconConceptSetSchema,
  SelectionsFileSchema,
  StyleDNASchema,
  MVP_DEFAULTS,
  type ConceptLetter,
  type ContentCard,
  type IconConceptSet,
} from '../types/index.js';
import {
  readIconStyleBible,
  resolveSessionIconSetStyleId,
} from './icon-style-bible.js';

const CONCEPTS_BATCH_SYSTEM = `Generate different ICON visual concepts per marketing card.

Each concept is a concrete English visual object (not an abstract label).

Return JSON only:
{
  "byCardId": {
    "card-id": {
      "concepts": [
        {
          "id": "A",
          "label": "short English name",
          "visualObject": "one recognizable object or process artifact — English only, 8-120 chars"
        }
      ]
    }
  }
}

Rules:
- Exactly N concepts per card with ids A, B, C (…).
- Each visualObject is a DIFFERENT concrete metaphor for the card meaning.
- One object or symbol only — NOT a photo, NOT a scene, NOT a room.
- No text, letters, charts with numbers, tables, UI screenshots.
- Do NOT use: soil, dirt, roots, grass field, studio, floor, wall, outdoor scene (blocked by icon preset).
${ANTI_PATTERN_PROMPT_RULES}`;

function tryConceptVisualObject(
  text: string,
  preset: IconSetStylePreset,
): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  let vo = extractVisualObject(trimmed, preset);
  if (!vo) {
    vo = extractVisualObject(trimmed.replace(/^isometric\s+stylized\s+/i, ''), preset);
  }
  if (!vo || hasAntiPattern(vo) || vo.length < 12) return '';
  return vo;
}

/** LLM metaphors often mention soil/roots — fall back to semantic layer when sanitizer strips them. */
function resolveConceptVisualObject(
  rawVo: string,
  label: string,
  preset: IconSetStylePreset,
  sem: CardSemantic | null,
  conceptIndex: number,
): string {
  const fromLlm = tryConceptVisualObject(rawVo, preset);
  if (fromLlm) return fromLlm;

  const fromLabel = tryConceptVisualObject(label, preset);
  if (fromLabel) return fromLabel;

  if (!sem) return '';

  const pool = [sem.visualObject, ...(sem.visualFocus ?? [])].filter(Boolean);
  for (let i = 0; i < pool.length; i++) {
    const vo = tryConceptVisualObject(pool[(conceptIndex + i) % pool.length]!, preset);
    if (vo) return vo;
  }

  return '';
}

function buildCardPromptLines(
  cards: ContentCard[],
  count: number,
  paths: SessionPaths,
): string {
  return cards
    .map((card) => {
      const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, count).join(', ');
      const sem = readCardSemantic(paths, card.id);
      const semLine = sem
        ? `  semantic: type=${sem.iconType}, object=${sem.visualObject}, focus=${sem.visualFocus.join('; ')}`
        : '  semantic: (none — infer from title)';
      return `- cardId: ${card.id}
  block: ${card.blockTitle ?? 'n/a'}
  title: ${card.title}
  description: ${card.description ?? 'n/a'}${semLine}
  metaphor ids: ${letters}`;
    })
    .join('\n');
}

async function writeConceptSet(
  paths: SessionPaths,
  card: ContentCard,
  concepts: Array<{
    id: ConceptLetter;
    label: string;
    visualObject: string;
  }>,
  preset: ReturnType<typeof getIconSetStyle>,
): Promise<void> {
  const set = IconConceptSetSchema.parse({
    cardId: card.id,
    cardTitle: card.title,
    concepts: concepts.map((c) => {
      const subjectLine = buildSubjectLine(c.visualObject, preset);
      return {
        id: c.id,
        label: c.label,
        visualObject: c.visualObject,
        iconSubject: subjectLine,
        description: c.visualObject,
      };
    }),
    generatedAt: new Date().toISOString(),
  });
  writeJsonFile(path.join(paths.conceptsDir, `${slugify(card.id)}.json`), set);
}

export async function runConcepts(
  paths: SessionPaths,
  opts: { cardId?: string; cardIds?: string[]; maxConcepts?: number },
): Promise<void> {
  readJsonFile(paths.styleDna, StyleDNASchema);
  const bible = readIconStyleBible(paths);
  const iconSetStyleId = bible?.iconSetStyleId ?? resolveSessionIconSetStyleId(paths);
  const preset = getIconSetStyle(iconSetStyleId);
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const count = Math.min(
    opts.maxConcepts ?? MVP_DEFAULTS.conceptsPerCard,
    MVP_DEFAULTS.maxConcepts,
  );

  let targets = cards.filter((c) => !c.skipped);
  if (opts.cardId) {
    targets = targets.filter((c) => c.id === opts.cardId);
  } else if (opts.cardIds?.length) {
    const set = new Set(opts.cardIds);
    targets = targets.filter((c) => set.has(c.id));
  }

  if (targets.length === 0) throw new Error('No cards to process');

  const guardrails = presetConceptGuardrails(preset);
  const batchSize = MVP_DEFAULTS.conceptsBatchSize;

  for (let i = 0; i < targets.length; i += batchSize) {
    const chunk = targets.slice(i, i + batchSize);
    const raw = await visionJsonCompletion<{
      byCardId: Record<
        string,
        {
          concepts: Array<{
            id: string;
            label: string;
            visualObject?: string;
            iconSubject?: string;
            description?: string;
          }>;
        }
      >;
    }>(
      CONCEPTS_BATCH_SYSTEM,
      `${guardrails}

Generate exactly ${count} different concepts per card (unique visualObject each).

Cards:
${buildCardPromptLines(chunk, count, paths)}`,
      [],
      { textOnly: true },
    );

    const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, count);

    for (const card of chunk) {
      const entry = raw.byCardId?.[card.id];
      const sem = readCardSemantic(paths, card.id) ?? null;
      const usedVisuals = new Set<string>();
      const concepts = (entry?.concepts ?? []).slice(0, count).map((c, idx) => {
        const rawVo = (c.visualObject ?? c.iconSubject ?? c.description ?? '').trim();
        const label = (c.label ?? letters[idx]).trim();
        let visualObject = resolveConceptVisualObject(
          rawVo,
          label,
          preset,
          sem,
          idx,
        );
        if (!visualObject || usedVisuals.has(visualObject)) {
          for (let attempt = 0; attempt < (sem?.visualFocus.length ?? 0) + 2; attempt++) {
            const alt = resolveConceptVisualObject(
              '',
              '',
              preset,
              sem,
              idx + attempt + 1,
            );
            if (alt && !usedVisuals.has(alt)) {
              visualObject = alt;
              break;
            }
          }
        }
        if (!visualObject) {
          throw new Error(
            `Concept "${letters[idx]}" for card "${card.id}" failed validation. Re-run concepts.`,
          );
        }
        usedVisuals.add(visualObject);
        return {
          id: letters[idx] as ConceptLetter,
          label,
          visualObject,
        };
      });

      if (concepts.length < count) {
        throw new Error(
          `Concept batch missing metaphors for card "${card.id}". Re-run: synaptik concepts --session ${paths.sessionId}`,
        );
      }

      await writeConceptSet(paths, card, concepts, preset);
    }
  }
}

/** Resolve visual object for Flux (never re-fallback to card title). */
export function resolveConceptForRender(
  set: IconConceptSet,
  conceptId: ConceptLetter,
  card?: ContentCard,
  iconSetStyleId?: IconSetStyleId,
): { visualObject: string; iconSubject: string; label: string } {
  const concept = set.concepts.find((c) => c.id === conceptId);
  if (!concept) throw new Error(`Concept ${conceptId} not found`);

  const preset = getIconSetStyle(iconSetStyleId ?? 'isometric');

  let visualObject = concept.visualObject?.trim() ?? '';
  if (!visualObject) {
    visualObject =
      extractVisualObject(concept.iconSubject, preset) ||
      extractVisualObject(concept.description, preset) ||
      '';
  }

  if (!visualObject) {
    throw new Error(
      `Concept ${conceptId} for card "${set.cardId}" has no valid visualObject. Regenerate concepts.`,
    );
  }

  const subjectLine = buildSubjectLine(visualObject, preset);

  return {
    visualObject,
    iconSubject: subjectLine,
    label: concept.label,
  };
}

export function runSelectConcept(
  paths: SessionPaths,
  cardId: string,
  conceptId: ConceptLetter,
): void {
  const existing = readJsonFile(paths.selections, SelectionsFileSchema);
  const filtered = existing.selections.filter((s) => s.cardId !== cardId);
  filtered.push({ cardId, conceptId });
  writeJsonFile(paths.selections, { selections: filtered });
}

export function getConceptSetForCard(
  paths: SessionPaths,
  cardId: string,
): IconConceptSet {
  const file = path.join(paths.conceptsDir, `${slugify(cardId)}.json`);
  return readJsonFile(file, IconConceptSetSchema);
}
